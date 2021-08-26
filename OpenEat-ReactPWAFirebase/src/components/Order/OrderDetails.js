import React, { useContext, useEffect, useState } from "react";
import { getOrder, getOrderProducts } from "../../firebase";
import { withRouter } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { formatDate } from "../Utils/Utils";
import Rating from "./Rating";
import Comment from "./Comment";

const OrderDetails = ({ match }) => {

  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState(undefined);

  useEffect(() => {
    getOrder(match.params.id, user).then(function (result) {
      setOrder({ id: result.id, ...result.data() });
    });
    getOrderProducts(match.params.id, user).then(function (querySnapshot) {
      setProducts(querySnapshot.docs.map((product) => {
        return { id: product.id, ...product.data() };
      }));
    });
  }, [user, match.params.id]);

  return (
    <>
      <div className="container min-vh-100 pt-6">
        {order &&
        <>
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between">
            <h1 className="title-bordered">Commande chez {order.restaurant.name}</h1>
            <div className="text-muted">
              {formatDate(order.date.toDate().toISOString())}
            </div>
          </div>
        </>
        }
        <h2 className="h4">Ce que vous avez commandé</h2>
        {products.length > 0 &&
        <ul className="mt-3 list-group">
          {products.map((product) =>
            <li key={product.id} className="list-group-item d-flex align-items-center">
              <span className="badge badge-primary mr-3">{product.quantity}</span> {product.name}
            </li>,
          )}
        </ul>
        }
        {order &&
          <>
            <Rating order={order} user={user}/>
            <Comment order={order} user={user}/>
          </>
        }
      </div>
    </>
  );
};

export default withRouter(OrderDetails);
