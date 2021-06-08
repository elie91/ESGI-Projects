export const addItemToCart = (cartItems, cartItemsToAdd) => {
  const existing = cartItems.find(
    cartItem => cartItem.name === cartItemsToAdd.name
  );

  if (existing) {
    return cartItems.map(item => {
      if (item.name === cartItemsToAdd.name) {
        return { ...item, quantity: item.quantity + 1 }
      } else {
        return item
      }
    })
  }

  return [...cartItems, { ...cartItemsToAdd, quantity: 1 }]
}

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  const existing = cartItems.find(
    cartItem => cartItem.name === cartItemToRemove.name
  );

  if (existing.quantity === 1) {
    return cartItems.filter(cartItem => cartItem.name !== existing.name)
  }

  return cartItems.map(cartItem =>
    cartItem.name === cartItemToRemove.name
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  )
}
