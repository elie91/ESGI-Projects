import React from "react";
import CartItem from "./CartItem";
import "../../sass/components/_cart-dropdown.scss";
import useProducts from "../../hooks/useProducts";
import {withRouter} from "react-router-dom";

const CartDropdown = ({history}) => {
  const { selectors, actions } = useProducts();

  const _onClick = () => {
    actions.toggleCartHidden();
    history.push('/order')
  }

  return (
    <div className='cart d-flex justify-content-between flex-column'>
      <div className="cart-header">
        Mon panier
      </div>
      <div className="px-3">
        {
          selectors.getCartItems().length > 0
            ?
            (selectors.getCartItems().map((item, index) => <CartItem key={index} item={item}/>))
            :
            (<p className="px-3 py-2 text-center mb-0">Votre panier est vide</p>)
        }
      </div>
      {selectors.getCartItems().length > 0 &&
        <div className="d-flex px-3 justify-content-between">
          <div>
            Total :
          </div>
          <div>
            {selectors.getCartItems().reduce((acc, val) => acc + (val.price * val.quantity), 0)} €
          </div>
        </div>
      }
      <div className="text-center">
        <div className="dropdown-divider"/>
        <button className='btn text-primary mb-2' onClick={_onClick}>
          Valider le panier
        </button>
      </div>
    </div>
  );
};

export default withRouter(CartDropdown);
