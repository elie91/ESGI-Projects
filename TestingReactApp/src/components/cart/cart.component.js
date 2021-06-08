import React, {useState} from "react";
import {ENTRYPOINT} from "../../config/entrypoint";
import {checkResponse} from "../../utils/responseUtils";

const Cart = ({cart, handleDelete}) => {

  const [fruits, setFruits] = useState(cart.cartFruits);

  const _handleDeleteFruit = (fruit) => {
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
  }

  const _updateQuantity = (fruit, type) => {
    let quantity = fruit.quantity;
    if (type === 'more'){
      quantity++;
    }else{
      quantity--
    }
    fetch(ENTRYPOINT + fruit["@id"], {
      method: 'PUT',
      body: JSON.stringify({quantity: quantity}),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(value => {
      setFruits(fruits.map((fruit) => {
        if(fruit['@id'] === value['@id']){
          fruit.quantity = quantity;
        }
        return fruit;
      }));
    })
    //.catch(error => setError(error.toString()))
  }

  return (
    <div className="col-md-4 mt-4 text-center cart-fruit">
      <div className="card h-100">
        <div className="card-body">
          <h3 className='fruit-title'>Panier {cart.id}</h3>
          <div>
            <h5>Fruits</h5>
            <ul className="list-group">
              {fruits && fruits.map(cart_fruits =>
                <li className="d-flex justify-content-between align-items-center" key={cart.id + ' ' + cart_fruits.fruit.id}>
                <span>{cart_fruits.fruit.name}</span>
                <span> x{cart_fruits.quantity} </span>
                <span>
                  {cart_fruits.quantity < 5 && <button
                    className='btn text-dark'
                    onClick={() => _updateQuantity(cart_fruits, 'more')}><i className="fas fa-plus-circle"/>
                  </button>
                  }
                  {cart_fruits.quantity > 1 && <button
                    className='btn text-dark'
                    onClick={() =>  _updateQuantity(cart_fruits, 'less')}><i className="fas fa-minus-circle"/>
                  </button>}
                  <button
                    id={"delete-cart-" + cart.id + "-fruit-" + cart_fruits.id} className='btn text-danger'
                    onClick={() => _handleDeleteFruit(cart_fruits)}><i className="fas fa-trash-alt"/>
                  </button>
                </span>
              </li>)}
            </ul>

          </div>
          <div className='d-flex justify-content-between'>
            <button className='btn text-danger btn-delete' onClick={(event) => handleDelete(event, cart)}><i
              className="fas fa-trash-alt"/></button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default React.memo(Cart);
