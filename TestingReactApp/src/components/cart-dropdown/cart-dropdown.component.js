import React, {useState} from 'react';
import CartItem from '../cart-item/cart-item.component';
import './cart-dropdown.style.scss'
import {ENTRYPOINT} from "../../config/entrypoint";

const CartDropdown = ({cartItems, setCartItems, setCartHidden, carts, setCarts, fruits}) => {

  const [tempCart, setTempCart] = useState(carts);

  const _onClick = (e) => {
    e.preventDefault();
    fetch(ENTRYPOINT + '/carts', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/ld+json'
      }
    })
      .then(response => response.json())
      .then(value => {
        cartItems.forEach(function (item) {
          fetch(ENTRYPOINT + '/cart_fruits', {
            method: 'POST',
            body: JSON.stringify({
              fruit: item.id,
              cart: value["@id"],
              quantity: item.quantity
            }),
            headers: {
              'content-type': 'application/json',
              'Accept': 'application/ld+json'
            }
          }).then(response => response.json())
            .then(value => {
              // Not work list not update
              if (tempCart.find(cart => cart['@id'] === value.cart)) {
                const _carts = tempCart.map((cart) => {
                  if (cart["@id"] === value.cart) {
                    let cart_fruits = value;
                    cart_fruits.fruit = fruits.find(fruit => fruit["@id"] === value.fruit)
                    cart.cartFruits.push(cart_fruits)
                    return cart;
                  }
                });
                setCarts(_carts)
              } else {
                let obj = {
                  "@id": value.cart,
                  "@type": "Cart",
                  id: parseInt(value.cart.replace('/carts/', '')),
                  cartFruits: [
                    {
                      cart: value.cart,
                      fruit: fruits.find(fruit => fruit["@id"] === value.fruit),
                      quantity: value.quantity
                    }
                  ]
                }
                setCarts([...carts, obj])
              }
            })
        })
        setCartItems([])
        setCartHidden(true);
      })
  }

  return (
    <div className='cart'>
      <div className='cart__items'>
        {
          cartItems.length
            ?
            (cartItems.map((item, index) => <CartItem key={index} item={item}/>))
            :
            (<span className='cart__message'>Votre panier est vide</span>)
        }
      </div>
      <button className='btn btn-dark w-100 d-flex justify-content-center' id='submit-cart' onClick={_onClick}>
        Confirmer
      </button>
    </div>
  );
}

export default CartDropdown;
