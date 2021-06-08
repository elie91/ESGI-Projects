import React, {useEffect, useState} from "react";
import {Route, Switch} from "react-router-dom";
import FruitsList from "./components/fruits-list/fruits-list.component";
import Navbar from "./components/navbar/navbar.component";
import AddFruit from "./components/add-fruit/add-fruit.component";
import Error from "./components/error/error.component";
import EditFruit from "./components/edit-fruit/edit-fruit";
import {ENTRYPOINT} from "./config/entrypoint";

const App = () => {

  const [fruits, setFruits] = useState([]);
  const [carts, setCarts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [hidden, setCartHidden] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(ENTRYPOINT + '/fruits')
      .then(response => response.json())
      .then(value => { setFruits(value['hydra:member'])})
      .catch(err => setError(err))
    fetch(ENTRYPOINT + '/carts')
      .then(response => response.json())
      .then(value => setCarts(value['hydra:member']))
      .catch(err => setError(err))
  }, []);

  return (
    <>
      <Navbar cartItems={cartItems} setCartItems={setCartItems} carts={carts} fruits={fruits} hidden={hidden} setCartHidden={setCartHidden} setCarts={setCarts}/>
      <div className="container">
        {error && <Error error={error}/>}
        <Switch>
          <Route path="/" exact render={() => <FruitsList fruits={fruits} carts={carts} setCarts={setCarts} setFruits={setFruits} cartItems={cartItems}
                        addToCart={setCartItems}/>}/>
          <Route path="/add-fruit" exact render={() => <AddFruit fruits={fruits} setFruits={setFruits}/>}/>
          <Route path="/edit-fruit" exact render={() => <EditFruit fruits={fruits} setFruits={setFruits}/>}/>
          <Route render={() => <h1>Not Found</h1>}/>
        </Switch>
      </div>
    </>
  )
};


export default App;
