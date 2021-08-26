import React from "react";
import { NavLink } from "react-router-dom";
import CartDropdown from "../Cart/CartDropdown";
import CartIcon from "../Cart/CartIcon";
import useProducts from "../../hooks/useProducts";

const Navbar = () => {

  const { selectors: productsSelectors } = useProducts();

  return (
    <nav className="navbar navbar-expand-lg navbar-light position-fixed w-100 bg-white">
      <div className='navbar__links'>
        <NavLink to='/' className='navbar-brand'>Site Marchand</NavLink>
      </div>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/credentials">Mes identifiants</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/orders">Mes commandes</NavLink>
          </li>
          <CartIcon/>
        </ul>
      </div>
      {!productsSelectors.getCartHidden() && <CartDropdown/>}

    </nav>
  );
};

export default React.memo(Navbar);
