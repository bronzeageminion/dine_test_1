import React from 'react';
import { Card } from 'react-bootstrap';
import './menuItems.css';
import NonVeg from '../images/nonVeg.svg';
import Vegg from '../images/Veg.svg';
import Eggi from '../images/Egg.svg';

const MenuItems = (props) => {

  const showVegOrNonVegImage = (vegOrNonVeg) => {
      if(vegOrNonVeg === "non-veg") {
          return (
              <img src={NonVeg} alt="non-veg"/>
          )
      } else if(vegOrNonVeg === "egg") {
          return(
              <img src={Eggi} alt="egg"/>
          )
      } else {
          return(
              <img src={Vegg} alt="veg"/>

          )
      }
  }

  const showSubcategoryIfHave = () => {
      if(props.subcategory) {
          const list = props.subcategory.map((subcategoryItem) =>
            <div key={subcategoryItem._id} class="dropdown-item">
                {subcategoryItem.half ? <li className="row sub-row"><div className="col-8">{subcategoryItem.itemName}</div><div className="col-4 sub-price-col">{subcategoryItem.full}/{subcategoryItem.half}</div></li> : <li className="row sub-row"><div className="col-9">{subcategoryItem.itemName}</div><div className="col-3 sub-price-col">{subcategoryItem.full}/(n.a)</div></li>}
            </div>
        );

        return (
          <div class="sub-drop dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Subcategories
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <div class="dropdown-item row sub-row sub-drop-head">
                  <div className="col-8">Subcategory Name</div><div className="col-4 sub-price-col">Price: ₹ (F/H)</div>
              </div>
              {list}
            </div>
          </div>

        );
      } else {
          return(<div className="item-price">₹ {props.price}</div>)
      }
  }

        return (

                <Card className="card-for-item" bg="light">
                    <Card.Body>
                        <Card.Title>
                            <div className="item-name">{props.itemName} {props.itemAvailability ? null : <i class="fas fa-low-vision na-icon"></i>}</div>
                            <div className="vnv-id">{showVegOrNonVegImage(props.vegOrNonVeg)}</div>
                        </Card.Title>
                        <Card.Text className="item-description">
                            {props.description}
                        </Card.Text>

                    </Card.Body>
                    <Card.Footer>

                          {showSubcategoryIfHave()}

                      <div className="cardBtn-div">
                        <button type="button" className="edit-btn card-btn" onClick={ () => {props.editItem(props.itemName)}}>
                          Edit
                        </button>
                        <button type="button" className="delete-btn card-btn" onClick={ () => {props.deleteItemFromMenu(props.itemId)}}>
                          Delete
                        </button>
                      </div>
                    </Card.Footer>
                </Card>


        );

}

export default MenuItems;
