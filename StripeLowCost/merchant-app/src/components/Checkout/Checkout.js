import React, { useState } from "react";
import useProducts from "../../hooks/useProducts";
import CheckoutItem from "../../components/Checkout/CheckoutItem";
import Input from "../../components/Styled/Input";
import { credentialsExist, getCredentials } from "../../utils/utils";
import { Link, withRouter } from "react-router-dom";
import { API_PAYMENT, API_TRANSACTIONS } from "../../config";

const Checkout = ({ history }) => {

    const { selectors: productsSelectors, actions } = useProducts();

    const [userData, setUserData] = useState({
        lastname: "",
        firstname: "",
        address: "",
        postal_code: "",
        city: "",
    });

    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(false);

    const handleChange = event => {
        const { value, name } = event.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setSuccess(true);
        setError(undefined);
        if (credentialsExist()) {
            fetch(API_TRANSACTIONS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + getCredentials(),
                },
                body: JSON.stringify({
                    client_firstname: userData.firstname,
                    client_lastname: userData.lastname,
                    billing_address: userData.address,
                    billing_postal_code: userData.postal_code,
                    billing_city: userData.city,
                    amount: productsSelectors.getCartItems().reduce((acc, val) => acc + (val.price * val.quantity), 0),
                    products: productsSelectors.getCartItems(),
                }),
            }).then(data => {
                if (data.status === 201) {
                    data.json().then(data => {
                          setTimeout(() => {
                              actions.clearCart();
                              window.location = API_PAYMENT + data.transaction.id;
                          }, 5000);
                      },
                    );

                } else {
                    setSuccess(false);
                    data.json().then(error => console.error(error) || setError(error))
                }
            })
              .catch(err => setError("Une erreur est survenue"));
        } else {
            setError("Vous devez saisir vos identifiants");
        }
    };

    return (
      <div className="container-fluid pt-6">
          <div className="row">
              <div className="col-md-6">
                  <div className="card">
                      <div className="card-body">
                          <div className="card-title">
                              <h2 className="h3">Récapitulatif de commande</h2>
                          </div>
                          {productsSelectors.getCartItems().length > 0 ?
                            <>
                                <table className='table table-borderless'>
                                    <thead>
                                    <tr>
                                        <th>Produits</th>
                                        <th>Quantité</th>
                                        <th>Prix</th>
                                        <th className="text-right">Supprimer</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {productsSelectors.getCartItems().map((cartItem, index) => <CheckoutItem key={index}
                                                                                                             cartItem={cartItem}/>)}
                                    </tbody>
                                </table>
                                <div className="dropdown-divider"/>
                                <div className="d-flex px-2 justify-content-between">
                                    <div className="font-weight-bold">
                                        Total :
                                    </div>
                                    <div>
                                        {productsSelectors.getCartItems().reduce((acc, val) => acc + (val.price * val.quantity), 0)} €
                                    </div>
                                </div>
                            </>
                            : <p>Votre panier est vide</p>}
                      </div>
                  </div>
              </div>
              <div className="col-md-6">
                  <div className="card">
                      <div className="card-body">
                          <div className="card-title">
                              <h1 className="h3">Informations complémentaires</h1>
                          </div>
                          <form onSubmit={handleSubmit}>
                              <div className="row">
                                  <Input name="lastname" label="Nom" autoComplete="family-name" className="col-md-6"
                                         onChange={handleChange} error={error}/>
                                  <Input name="firstname" label="Prénom" autoComplete="given-name" className="col-md-6"
                                         onChange={handleChange} error={error}/>
                                  <Input name="address" label="Adresse" autoComplete="address-line1" className="col-md-12"
                                         onChange={handleChange} error={error}/>
                                  <Input name="postal_code" label="Code postal" autoComplete="postal-code" className="col-md-5"
                                         onChange={handleChange} error={error}/>
                                  <Input name="city" label="Ville" autoComplete="address-level2" className="col-md-7"
                                         onChange={handleChange} error={error}/>
                              </div>
                              {error && error.message &&
                              <p className="text-danger text-center">{error.message}</p>
                              }
                              <div className="text-center">
                                  {!success ?
                                    <button className="btn mt-2 btn-primary"
                                            disabled={productsSelectors.getCartItems().length === 0 ? "disabled" : false} type="submit">
                                        Procéder au paiement
                                    </button>
                                    : <div id="loader" className="sk-chase">
                                        <div className="sk-chase-dot"/>
                                        <div className="sk-chase-dot"/>
                                        <div className="sk-chase-dot"/>
                                        <div className="sk-chase-dot"/>
                                        <div className="sk-chase-dot"/>
                                        <div className="sk-chase-dot"/>
                                    </div>}
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
};

export default withRouter(Checkout);
