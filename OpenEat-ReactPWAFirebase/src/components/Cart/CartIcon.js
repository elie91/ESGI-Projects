import React from "react";
import {ReactComponent as ShoppingIcon} from '../../images/shopping-bag.svg';

const CartIcon = ({cartItems, hidden, setCartHidden}) => {

  const count = cartItems.reduce(
    (accumulator, item) => accumulator + item.quantity, 0
  );

  return (
    <div className='cart-icon' onClick={() => setCartHidden(!hidden)}>
      <ShoppingIcon className='shopping-icon'/>
      <span className='item-count'>{count}</span>
    </div>
  );
}

export default React.memo(CartIcon);
