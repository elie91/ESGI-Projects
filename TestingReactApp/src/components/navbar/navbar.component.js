import React from 'react';
import {Link} from "react-router-dom";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";
import CartIcon from "../cart-icon/cart-icon.component";

const Navbar = ({cartItems, setCartItems, hidden, setCartHidden, carts, setCarts, fruits}) => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between">
      <Link to='/' className="navbar-brand"> Fruits </Link>
      <div className='d-flex'>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="add-fruit">
              <button className='btn btn-primary'>Ajouter un fruit</button>
            </Link>
          </li>
        </ul>

        <CartIcon cartItems={cartItems} setCartHidden={setCartHidden} hidden={hidden}/>
        {!hidden && <CartDropdown cartItems={cartItems}
                                  setCartHidden={setCartHidden}
                                  setCartItems={setCartItems}
                                  carts={carts}
                                  setCarts={setCarts}
                                  fruits={fruits}/>}
      </div>

    </nav>
  )
}

export default Navbar;
