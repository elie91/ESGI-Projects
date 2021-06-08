//import {addRestaurant} from "../../firebase";

export const addItemToCart = (cartItems, cartItemsToAdd) => {

  const existing = cartItems.find(
    cartItem => cartItem.name === cartItemsToAdd.name,
  );

  if (existing) {
    return cartItems.map(item => {
      if (item.name === cartItemsToAdd.name) {
        return { ...item, quantity: item.quantity + 1 };
      } else {
        return item;
      }
    });
  }

  return [...cartItems, { ...cartItemsToAdd, quantity: 1 }];

};

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  const existing = cartItems.find(
    cartItem => cartItem.id === cartItemToRemove.id,
  );

  if (existing.quantity === 1) {
    return cartItems.filter(cartItem => cartItem.id !== existing.id);
  }

  return cartItems.map(cartItem =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem,
  );
};

export const formatDate = (date) => {
  let _date = date.split("T");
  let _time = _date[1].split(":");
  _date = _date[0].split("-");
  return `${_date[2]}/${_date[1]}/${_date[0]} à ${_time[0]}:${_time[1]}`;
};

/*export const generateRestaurants = (number) => {
  for (let i = 0; i < number; i++) {
    addRestaurant().then(function () {
      console.log("Restaurant created");
    });
  }
};*/
