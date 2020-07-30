var mongoose = require('mongoose');
// model
var Shop = mongoose.model('Shop');
var Menu = mongoose.model('Menu');
const {ObjectId} = require('mongodb');


module.exports = app => {  
    
    //post/add new shop
    app.put('/shop', function(request, response) {
        Shop.updateOne({ownerEmail: request.body.userEmail}, {$push: {shop: {shopName: request.body.shopName, shopAddress: {value: request.body.shopAddress}, noOfTables: request.body.noOfTables}}}, function(err, shop) {
            if (err) {
                response.status(500).send({error: "Could not complete the shop registration"});
            } else {
                //db.users.find({awards: {$elemMatch: {award:'National Medal', year:1975}}})
                //var shopIdVar = 
                Shop.find({"shop.shopName": request.body.shopName}, { _id: 0, ownerEmail: 0, shop: {$elemMatch: {shopName: request.body.shopName}}}).exec(function(err, shopId) {
                    //response.send(shopId)
                    console.log(shopId[0].shop[0]._id);

                    new Menu({shopId: shopId[0].shop[0]._id}).save().then((newMenu) => {
                        //console.log(shop._id);
                        console.log(newMenu);
                     })
                })

                response.send(shop); 
            }
        });
    });
    
    //get shop by email address
    app.get('/shop/get_shops/:userEmail', function(request, response) {
        Shop.find({ownerEmail: request.params.userEmail}, {_id:0, shop: 1}).exec(function(err, shop) {
            if(err) {
                response.status(500).send({error: "No Shop List"});
            } else {
                response.send(shop);
            }
        });
    });
    
    //add item to shop menu
    app.put('/menu', function(request, response) {
        Menu.updateOne({shopId: request.body.shopId}, {$push: {menu: {itemName: request.body.itemName, vegOrNonVeg: request.body.vegOrNonVeg, price: request.body.price, description: request.body.description, category: request.body.category}}}, function(err, menu) {
            if (err) {
                response.status(500).send({error: "Could not update the menu"});
            } else {
                response.send(menu); 
            }
        });
    });
    
    //get shop menu from shop id
    app.get('/menu/:shopId', function(request, response) {
        Menu.find({shopId: request.params.shopId}, {_id:0, menu: 1}).exec(function(err, menu) {
            if(err) {
                response.status(500).send({error: "No Menu For this Shop"});
            } else {
                //menu[0].menu
                response.send(menu);
            }
        });
    });
    
    //delete item from shop menu
    app.put('/menu/item/delete', function(request, response) {
        Menu.updateOne({shopId: request.body.shopId}, {$pull : {"menu": {"_id": {$in : ObjectId(request.body.itemId)}}}}, function(err, menu) {
            if (err) {
                console.log(err);
                response.status(500).send({error: "Could not find the item"});
            } else {
                response.send(menu);
            }
        })
    });
    
    //update an item in shop menu
    app.put('/menu/item_update', function(request, response) {
        Menu.updateOne({shopId: request.body.shopId, "menu._id": request.body.menuItemId}, {$set: {"menu.$.itemName": request.body.itemName, "menu.$.vegOrNonVeg": request.body.vegOrNonVeg, "menu.$.price": request.body.price, "menu.$.description": request.body.description, "menu.$.category": request.body.category}}, function(err, menuItem) {
            if (err) {
                response.status(500).send({error: "Could not update the menu Item"});
            } else {
                response.send(menuItem); 
            }
        });
    });
    
    //get set of shop item_categories
    app.get('/item_categories/:shopId', function(request, response) {
        Menu.distinct("menu.category", {shopId: request.params.shopId}).exec(function(err, menuCategory) {
            if(err) {
                response.status(500).send({error: "No Shop List"});
            } else {
                response.send(menuCategory);
            }
        });
    });
    
    //get items by category from shop menu
    app.get('/items', function(request, response) {
        Menu.aggregate([{$match: {shopId: request.query.shopId}}, {$unwind: "$menu"}, {$match: {"menu.category": request.query.category}}, {$project: {_id: 0, menu: 1}}]).exec(function(err, menu) {
            if(err) {
                response.status(500).send({error: "No Such item in Menu"});
            } else {
                //menu[0].menu
                response.send(menu);
            }
        });
    });    
    
    //get items Name for autocomplete
    app.get('/items_name/for-autoComplete/:shopId', function(request, response) {
        Menu.find({shopId: request.params.shopId}, {_id:0, "menu.itemName": 1}).exec(function(err, itemNameList) {
            if(err) {
                response.status(500).send({error: "No Menu For this Shop"});
            } else {
                //menu[0].menu
                response.send(itemNameList[0].menu);
            }
        });
    });
    
    //get no. of tables for a restaurant
    app.get('/tables_no', function(request, response) {
        Shop.aggregate([{$match: {ownerEmail: request.query.userEmail}}, {$unwind: "$shop"}, {$match: {"shop._id": ObjectId(request.query.shopId)}}, {$project: {_id: 0, "shop.noOfTables": 1}}]).exec(function(err, shop) {
            if(err) {
                response.status(500).send({error: "No Such Shop"});
            } else {
                response.send(shop[0].shop);
            }
        });
    });
    
    //delete shop
    app.put('/shop/delete', function(request, response) {
        Shop.updateOne({ownerEmail: request.body.userEmail}, {$pull : {"shop": {"_id": {$in : ObjectId(request.body.shopId)}}}}, function(err, shop) {
            if (err) {
                console.log(err);
                response.status(500).send({error: "Could not find the item"});
            } else {
                Menu.deleteOne({shopId: request.body.shopId}).exec(function(err, menu) {
                    console.log('menu deleted')
                })
                
                response.send(shop);
            }
        })
    });
    
    //add email for kitchen access
    app.put('/email_access', function(request, response) {
        Shop.updateOne({ownerEmail: request.body.userEmail, "shop._id": request.body.shopId}, {$addToSet: {emailAccessList: request.body.email}}, function(err, emailList) {
            if (err) {
                response.status(500).send({error: "Could not update the email List. Check your shopId or email"});
            } else {
                response.send(emailList); 
            }
        });
    });
    
    
};