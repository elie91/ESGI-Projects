import React from "react";
import useProducts from "../../hooks/useProducts";

const CheckoutItem = ({ cartItem }) => {

  const { actions } = useProducts();

  return (
    <tr>
      <td>{cartItem.name}</td>
      <td className="d-flex justify-content-between">
        <span className="arrow cursor" onClick={() => actions.removeItemFromCart(cartItem)}>&#10094;</span>
        <span className="value">{cartItem.quantity}</span>
        <span className="arrow cursor" onClick={() => actions.addItemToCart(cartItem)}>&#10095;</span>
      </td>
      <td>{cartItem.price * cartItem.quantity}</td>
      <td className="text-right">
        <span className='remove-button cursor' onClick={() => actions.clearItemFromCart(cartItem)}> &#10005;</span>
      </td>
    </tr>
  );

};

export default React.memo(CheckoutItem);
