import React from "react";
import {withRouter} from "react-router-dom";
import Fruit from "../fruit/fruit.component";
import {ENTRYPOINT} from "../../config/entrypoint";
import Cart from "../cart/cart.component";

export const FruitsList = ({fruits, carts, history, setFruits, setCarts, cartItems, addToCart}) => {

  const handleDelete = (event, fruit) => {
    fetch(ENTRYPOINT + fruit['@id'], {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((result) => {
        if (result.ok) {
          const filtered = fruits.filter(fr => fr.id !== fruit.id);
          setFruits(filtered)
        }
      })
      .then(() => history.push('/'))
  }

  const handleDeleteCart = (event, cart) => {
    fetch(ENTRYPOINT + cart['@id'], {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((result) => {
        if (result.ok) {
          const filtered = carts.filter(fr => fr.id !== cart.id);
          setCarts(filtered)
        }
      })
      .then(() => history.push('/'))
  }

  return (
    <>
      <h1 className="mt-3">Mes fruits</h1>
      <div className="row">
        {fruits.map(fruit => <Fruit key={fruit.id} fruit={fruit} addToCart={addToCart}
                                                         cartItems={cartItems}
                                                         handleDelete={handleDelete}/>)}
        {fruits.length === 0 && <div className="col-md-12"><p>Il n'y a pas de fruits</p></div>}
      </div>

      <h2 className="my-3">Mes paniers fruités</h2>
      <div className="row">

        {carts.map(cart => <Cart key={cart.id} cart={cart} handleDelete={handleDeleteCart}/>)}

        {carts.length === 0 && <div className="col-md-12"><p>Il n'y a pas de panier de fruit</p></div>}

      </div>
    </>

  );

}
export default withRouter(FruitsList);
