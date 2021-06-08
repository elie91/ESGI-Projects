export function combineReducers (reducerDict) {
  return function (state = {}, action) {
    return Object.keys(reducerDict).reduce((stateGlobal, curr) => {
      let slice = reducerDict[curr](state[curr], action);
      return { ...stateGlobal, [curr]: slice };
    }, state);
  };
}

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
    cartItem => cartItem.name === cartItemToRemove.name,
  );

  if (existing.quantity === 1) {
    return cartItems.filter(cartItem => cartItem.name !== existing.name);
  }

  return cartItems.map(cartItem =>
    cartItem.name === cartItemToRemove.name
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem,
  );
};

export function formatDate (date) {
  date = date.split('T');
  let hours = date[1].split('.');
  date = date[0].split('-');
  return date[2]+"/"+date[1]+"/"+date[0] + " à " + hours[0];
}

export const credentialsExist = () => {
  return !!(localStorage.getItem("merchant_public") && localStorage.getItem("merchant_secret"));
};

export function getCredentials () {
  return localStorage.getItem("merchant_public") + ":" + localStorage.getItem("merchant_secret");
}

export function _setCredentials (credentials) {
  localStorage.setItem("merchant_public", credentials.public);
  localStorage.setItem("merchant_secret", credentials.secret);
}

export function removeCredentials () {
  localStorage.removeItem("merchant_public");
  localStorage.removeItem("merchant_secret");
}
