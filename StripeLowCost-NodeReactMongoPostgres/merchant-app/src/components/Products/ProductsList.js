import React from "react";
import Product from "./ProductItem";
import useProducts from "../../hooks/useProducts";

const ProductsList = () => {
  const { selectors } = useProducts();

  return (
    <div className="container pt-6">
      <div className='products-list'>
        {selectors.getProducts().map((product, index) =>
          <Product product={product}  key={index}/>)}
      </div>
    </div>
  );
};

export default ProductsList;
