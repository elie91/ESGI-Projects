import React from "react";
import img from "../../images/drake-meme.jpg";

const OrderSuccess = () => {
  return (
    <div className="container pt-6">
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h1>Votre commande est en cours de préparation</h1>
          </div>
          <p>Merci d'avoir payer avec StripeLowCost, une solution éclaté au sol mais qui fonctionne.
            Espérons qu'on tape un petit 18 avec ce projet.
          </p>
          <div className="text-center">
            <img src={img} alt="drake meme" height="300"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess;
