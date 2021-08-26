import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../context/UserContext";
import { getOrders } from "../../firebase";
import { formatDate } from "../Utils/Utils";
import { Link } from "react-router-dom";
import ListLoader from "../Utils/ListLoader";
import { Offline, Online } from "react-detect-offline";

const OrderList = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unmounted = false
    getOrders(user).then(function (querySnapshot) {
      if (!unmounted) {
        setOrders(querySnapshot.docs.map((order) => {
          return { id: order.id, ...order.data() };
        }));
        setLoading(false);
      }
    });
    return () => {unmounted = true};
  }, [user]);

  return (
    <div className="container pt-6">
      <h1 className="title-bordered">Mes commandes</h1>
      {orders.length === 0 && loading && <ListLoader/>}
      {orders.length > 0 &&
      <ul className="list-group">
        {orders.map(order =>
          <li key={order.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <Link to={`/orders/${order.id}`} className="text-dark w-100">
              <div className="d-flex flex-column flex-sm-row justify-content-between w-100">
                <div>
                  Commande chez {order.restaurant.name}
                </div>
                <div className="text-muted">
                  {formatDate(order.date.toDate().toISOString())}
                </div>
              </div>
            </Link>
          </li>)}
      </ul>
      }
      {orders.length === 0 &&
      <p>
        <Online>Vous n'avez pas encore effectué de commande</Online>
        <Offline>Il semblerait que vous n'êtes pas connecté à Internet, Réessayez plus tard pour vos commandes</Offline>
      </p>
      }
    </div>
  );
};

export default OrderList;
