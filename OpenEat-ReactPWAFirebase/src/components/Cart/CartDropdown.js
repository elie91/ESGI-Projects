import React, { useState } from "react";
import CartItem from "./CartItem";
import { createOrder } from "../../firebase";
import { withRouter } from "react-router-dom";

const CartDropdown = ({ cartItems, setCartItems, setCartHidden, user, history }) => {

  const [error, setError] = useState(undefined);
  const [offline, setOffline] = useState(0);

  const _onClick = (e) => {
    e.preventDefault();
    if (cartItems.length > 0){
      if (user) {
        if (!navigator.onLine){
          setOffline(prev => prev + 1);
        }
        if (offline === 0){
          createOrder(user, cartItems).then(function () {
            setCartItems([]);
            setCartHidden(true);
            history.push('/orders');
          });
        }
        if (!navigator.onLine){
          setOffline(prev => prev + 1);
        }
      } else {
        history.push("/login");
        setCartHidden(true);
      }
    }else{
      setError("Vous devez ajouter des produits à votre panier");
    }
  };

  return (
    <div className='cart d-flex justify-content-between flex-column'>
      <div className="cart-header">
        Mon panier
      </div>
      <div className="px-3">
        {
          cartItems.length > 0
            ?
            (cartItems.map((item, index) => <CartItem key={index} item={item} cartItems={cartItems} setCartItems={setCartItems}/>))
            :
            (<p className="px-3 py-2 text-center mb-0">{error ? error : "Votre panier est vide"}</p>)
        }
      </div>
      <div className="text-center">
        <div className="dropdown-divider"/>
        <button className='btn text-primary mb-2' onClick={_onClick}>
          Valider le panier
        </button>
        {offline > 0 && offline < 3 && <div className="text-warning">Votre commande sera envoyé lorsque vous serez à nouveau connecté à Internet</div>}
        {offline > 3 && <div className="text-danger">Calme-toi sur le bouton gros, t'as pas de réseau</div>}
      </div>
    </div>
  );
};

export default withRouter(CartDropdown);
