import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import "../src/sass/components/_reset.scss";
import Navbar from "./components/Navbar/Navbar";
import useProducts from "./hooks/useProducts";
import { toast } from "react-toastify";
import ProfileCredentials from "./components/Profile/ProfileCredentials";
import ProfileOrders from "./components/Profile/ProfileOrders";
import ProductsList from "./components/Products/ProductsList";
import Checkout from "./components/Checkout/Checkout";
import OrderSuccess from "./components/Order/OrderSuccess";

toast.configure();

function App () {

  const { actions: productsActions } = useProducts();

  useEffect(() => {
    productsActions.fetchProducts();
  }, []);

  return (
    <div className="position-relative">
      <Navbar/>
      <ErrorBoundary>
        <Switch>
          <Route exact path="/" component={ProductsList}/>
          <Route exact path="/order" component={Checkout}/>
          <Route exact path="/credentials" component={ProfileCredentials}/>
          <Route exact path="/orders" component={ProfileOrders}/>
          <Route exact path="/order/success" component={OrderSuccess}/>
        </Switch>
      </ErrorBoundary>
    </div>
  );
}

export default App;
