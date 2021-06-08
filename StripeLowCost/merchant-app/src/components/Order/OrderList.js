import React, { useState } from "react";
import { formatDate, getCredentials } from "../../utils/utils";
import { API_TRANSACTION_REFUND } from "../../config";

const OrderList = ({ order }) => {

  const [type, setType] = useState(order.transactionStatus[0].name);

  const _onClick = (order) => {
    fetch(API_TRANSACTION_REFUND, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + getCredentials(),
      },
      body: JSON.stringify({transaction: order})
    }).then(() => setType("REFUND"))
      .catch(err => console.log(err))
  }

  return (
    <tr>
      <td>{order.id}</td>
      <td>{formatDate(order.createdAt)}</td>
      <td>
        <ul className="list-unstyled mb-0">
          {order.products.map((item, i) => <li key={i}>{item.quantity}x {item.name}</li>)}
        </ul>
      </td>
      <td>{order.amount} €</td>
      <td className="text-right">
        {type === "PAID" && <button className="btn btn-primary" onClick={() => _onClick(order.id)}>Rembourser</button>}
        {type === "CREATED" && <button className="btn btn-warning disabled" disabled>En cours de paiement</button>}
        {type === "REFUND" && <button className="btn btn-success disabled" disabled>Remboursé</button>}
      </td>
    </tr>
  );
};

export default React.memo(OrderList);
