import React from "react";
import useProducts from "../../hooks/useProducts";

const ProductItem = ({ product }) => {

  const { actions: productsActions } = useProducts();

  const handleAdd = (product) => {
    const {name, price} = product;
    productsActions.addItemToCart({ name, price });
  };

  return (
    <div className="card">
      <img className="img-fluid" height="160" src={product.image} alt={product.name}/>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.price} €</p>
        <button className="btn btn-primary" onClick={() => handleAdd(product)}>Ajouter au panier</button>
      </div>
    </div>
  );
};

export default React.memo(ProductItem);
