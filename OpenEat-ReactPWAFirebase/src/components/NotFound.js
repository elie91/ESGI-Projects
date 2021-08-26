import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container">
      <div className="row align-items-center min-vh-100">
        <div className="col-md-12">
            <div className="text-center">
              <h1>Oooops, la page a été supprimée ou déplacée</h1>
              <Link to="/" className="btn btn-primary mt-5">Retour à l'accueil</Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
