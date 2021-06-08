import React from 'react';
import { removeItemFromCart } from "../Utils/Utils";
import { ReactComponent as DeleteIcon } from "../../images/trash-solid.svg";

const CartItem = ({item, cartItems, setCartItems}) => (
    <div className='d-flex justify-content-between align-items-center py-2'>
      <div>{item.quantity} x {item.name}</div>
      <button className="btn btn-delete" onClick={() => setCartItems(removeItemFromCart(cartItems, item))}> <DeleteIcon className="icon text-danger"/></button>
    </div>
);

export default React.memo(CartItem);
