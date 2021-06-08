import React from 'react';
import './cart-item.style.scss';

const CartItem = ({item}) => (
  <div className='cart-item'>
    <div className='cart-item__details'>
      <span className='cart-item__price'>{item.quantity} x {item.name}</span>
    </div>
  </div>
);

export default React.memo(CartItem);
