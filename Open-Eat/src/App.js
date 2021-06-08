import React, { useContext, useEffect, useState } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import "./App.scss";
import UserContext from "./context/UserContext";
import BookmarkList from "./components/Bookmark/BookmarkList";
import Navigation from "./components/Navigation/Navigation";
import { getBookmarks } from "./firebase";
import PrivateRoute from "./components/PrivateRoute";
import RestaurantList from "./components/Restaurant/RestaurantList";
import Profile from "./components/Profile/Profile";
import Login from "./components/Security/Login";
import SignUp from "./components/Security/SignUp";
import OrderList from "./components/Order/OrderList";
import OrderDetails from "./components/Order/OrderDetails";
import NotFound from "./components/NotFound";
import RestaurantDetails from "./components/Restaurant/RestaurantDetails";

const App = ({history}) => {

  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [hidden, setCartHidden] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [loadBookmarks, setLoadingBookmarks] = useState(true);

  useEffect(() => {
    if (user) {
      getBookmarks(user).then(function (querySnapshot) {
        setLoadingBookmarks(false);
        setBookmarks(querySnapshot.docs.map((bookmark) => {
          return bookmark.data();
        }));
      }).catch(function (err) {
        console.log(err);
      });
    }else{
      setLoadingBookmarks(false)
      setBookmarks([]);
    }
  }, [user]);

  /*useEffect(() => {
    Uncomment if you want to generate restaurant
    generateRestaurants(3)
  }, []);*/

  return (
    <div className="App">
      {(history.location.pathname !== "/login" && history.location.pathname !== "/sign-up") &&
        <Navigation cartItems={cartItems} setCartItems={setCartItems} hidden={hidden} setCartHidden={setCartHidden}
                  user={user}/>
      }
      <Switch>
        <Route path="/login" exact render={() => !user ? <Login/> : <Redirect push to="/"/>}/>
        <Route path="/sign-up" exact render={() => <SignUp/>}/>
        <Route path={"/"} exact render={() => <RestaurantList bookmarks={bookmarks} setBookmarks={setBookmarks} isLoading={loadBookmarks}/>}/>
        <Route path={"/restaurants/:id"} exact render={() =>
          <RestaurantDetails cartItems={cartItems} addToCart={setCartItems} bookmarks={bookmarks}
                             setBookmarks={setBookmarks}/>
        }/>
        <PrivateRoute path={"/profile"} exact render={() => <Profile/>}/>
        <PrivateRoute path={"/orders"} exact render={() => <OrderList/>}/>
        <PrivateRoute path={"/orders/:id"} exact render={() => <OrderDetails/>}/>
        <PrivateRoute path={"/bookmarks"} exact
                      render={() => <BookmarkList bookmarks={bookmarks} setBookmarks={setBookmarks}/>}/>
        <Route render={() => <NotFound/>}/>
      </Switch>
    </div>
  );
};

export default withRouter(App);
