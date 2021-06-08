import React, { useContext, useEffect, useState } from "react";
import { storage } from "../../firebase";
import UserContext from "../../context/UserContext";
import "./../../assets/Cart.scss";
import CartIcon from "../Cart/CartIcon";
import CartDropdown from "../Cart/CartDropdown";
import { NavLink, withRouter } from "react-router-dom";
import { Offline, Online } from "react-detect-offline";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import {ReactComponent as Icon} from '../../images/bars-solid.svg';


const Navigation = ({ cartItems, setCartItems, hidden, setCartHidden, history }) => {

  const { user } = useContext(UserContext);
  const [avatar, setAvatar] = useState(undefined);
  const [hideOnScroll, setHideOnScroll] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y === 0
      if (isShow !== hideOnScroll) setHideOnScroll(isShow)
    },
    [hideOnScroll],
    null,
    false,
    300
  )

  useEffect(() => {
    if (user){
      storage.ref().child(`users/${user.avatar}`).getDownloadURL().then(function (url) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          // Loading
        };
        xhr.open("GET", url);
        xhr.send();
        setAvatar(url);
      }).catch(function (error) {
        console.error(error);
      });
    }

  }, [user]);

  const _closeAfterClick = () => {
    setCartHidden(true);
    setCollapsed(false);
  }

  return (
    <nav className={"navbar navbar-expand-lg fixed-top navbar-light bg-light" + (history.location.pathname === "/" && hideOnScroll ? " is-top": "")}>
      <NavLink className="navbar-brand font-weight-bold" to="/" onClick={() =>_closeAfterClick()}>Open Eat</NavLink>
      <button onClick={() => setCollapsed(!collapsed)} className={"navbar-toggler"  + (collapsed ? " open": "")} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <Icon className="navbar-icon"/>
      </button>
      <div className={"collapse navbar-collapse" + (collapsed ? " show": "")} id="navbarNavAltMarkup">
        <div className="navbar-nav ml-auto">
          {!user && <NavLink className="nav-item nav-link" to="/login">Se connecter</NavLink>}
          {user &&
            <>
              <NavLink className="nav-item nav-link" to="/bookmarks" onClick={() =>_closeAfterClick()}>Mes favoris</NavLink>
              <NavLink className="nav-item nav-link" to="/orders" onClick={() =>_closeAfterClick()}>Mes commandes</NavLink>
              <NavLink className="nav-item nav-link" to="/profile" onClick={() =>_closeAfterClick()}>{avatar &&
              <img className="rounded-circle avatar" src={avatar} alt="Avatar"/>} <span className="ml-2">Mon compte</span></NavLink>
            </>
          }
          <a className="nav-item nav-link disabled d-flex align-items-center" href="!#">
            <div>Statut</div>
            <Online><div className={"ml-2 pulse online"}/></Online>
            <Offline><div className={"ml-2 pulse offline"}/></Offline>
          </a>
        </div>
        <CartIcon cartItems={cartItems} setCartHidden={setCartHidden} hidden={hidden} onClick={() =>_closeAfterClick()}/>
        {!hidden &&
        <CartDropdown cartItems={cartItems} setCartHidden={setCartHidden} setCartItems={setCartItems} user={user}/>}
      </div>
    </nav>
  );
};

export default withRouter(Navigation);
