import React, { useEffect, useState } from "react";
import OrderList from "../Order/OrderList";
import { API_TRANSACTIONS } from "../../config";
import { getCredentials } from "../../utils/utils";

const ProfileOrders = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(API_TRANSACTIONS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + getCredentials(),
      },
    }).then(data => data.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="container pt-6">
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h1 className="h2">Mes commandes</h1>
          </div>
          {orders.length > 0 &&
          <table className="table table-borderless">
            <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Produits</th>
              <th>Montant</th>
              <th className="text-right">Actions</th>
            </tr>
            </thead>
            <tbody>
            {orders.map((order, index) => <OrderList order={order} key={index}/>)}
            </tbody>
          </table>}
          {orders.length === 0 && <p className="mb-0">Vous n'avez pas encore de commande</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileOrders;
