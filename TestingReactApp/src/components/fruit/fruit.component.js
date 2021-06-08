import React from "react";
import {addItemToCart} from "../../utils/cartUtils";
import {Link} from "react-router-dom";

const Fruit = ({fruit, cartItems, addToCart, handleDelete}) => {
  return (
    <div className="col-md-3 mt-4 text-center fruit">
      <div className="card">
        <div className="card-body">
          <h3 className='fruit-title'>{fruit.name}</h3>
          <div className='d-flex justify-content-between'>
            <button className="btn text-primary btn-add"
                    onClick={() => addToCart(addItemToCart(cartItems, {id: fruit["@id"], name: fruit.name}))}>
              <i className="fas fa-cart-plus"/>
            </button>
            <Link to={{pathname: '/edit-fruit', state: {fruit}}}>
              <button className='btn text-warning btn-edit'><i className="far fa-edit"/></button>
            </Link>
            <button className='btn text-danger btn-delete' onClick={(event) => handleDelete(event, fruit)}><i
              className="fas fa-trash-alt"/></button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default React.memo(Fruit);
