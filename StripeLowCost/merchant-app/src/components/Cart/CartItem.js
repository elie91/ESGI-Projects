import React from "react";
import useProducts from "../../hooks/useProducts";

const CartItem = ({ item }) => {

  const { actions } = useProducts();

  return (
    <div className="pb-2">
      <div className='d-flex justify-content-between align-items-center'>
        <div>{item.name}</div>
        <div className="d-flex align-items-center">
          <button className="btn btn-icon arrow" onClick={() => actions.removeItemFromCart(item)}>
            -
          </button>
          {item.quantity}
          <button className="btn btn-icon arrow" onClick={() => actions.addItemToCart(item)}>
            +
          </button>
        </div>
        <div>
          {item.price * item.quantity} €
        </div>
        <div
          className='remove-button'
          onClick={() => actions.clearItemFromCart(item)}> &#10005;</div>
      </div>
    </div>
  );
};

export default CartItem;
