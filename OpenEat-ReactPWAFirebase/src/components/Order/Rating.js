import React, { useEffect, useState } from "react";
import "./../../assets/Rating.scss";
import { ReactComponent as StarSolid } from "../../images/star-solid.svg";
import { ReactComponent as TimesSolid } from "../../images/times-solid.svg";
import { rateOrder } from "../../firebase";

const Rating = ({ order, user }) => {

  const [checked, setChecked] = useState(0);

  const _handleChange = (e) => {
    if (/^[0-5]$/.test(e.target.value)) {
      const rate = parseInt(e.target.value);
      setChecked(rate);
      rateOrder(order, user, rate).then(function () {
        console.log("Rated")
      });
    } else {
      console.error("Valeur entre 0-5");
    }
  };

  useEffect(() => {
    if (order.rate) {
      setChecked(order.rate);
    }
  }, [order]);

  return (
    <div id="full-stars-example">
      <h2 className="h4 mt-4">Noter votre commande</h2>
      <div className="rating-group">
        <input className="rating__input rating__input--none" name="rating" id="rating-none" value="0" type="radio"
               checked={checked === 0} onChange={_handleChange}/>
        <label aria-label="No rating" className="rating__label" htmlFor="rating-none">
          <TimesSolid className="rating__icon rating__icon--none"/>
        </label>
        <label aria-label="1 star" className="rating__label" htmlFor="rating-1">
          <StarSolid className="h-20 rating__icon--star rating__icon"/>
        </label>
        <input className="rating__input" name="rating" id="rating-1" value="1" type="radio" checked={checked === 1}
               onChange={_handleChange}/>
        <label aria-label="2 stars" className="rating__label" htmlFor="rating-2">
          <StarSolid className="h-20 rating__icon--star rating__icon"/>
        </label>
        <input className="rating__input" name="rating" id="rating-2" value="2" type="radio" checked={checked === 2}
               onChange={_handleChange}/>
        <label aria-label="3 stars" className="rating__label" htmlFor="rating-3">
          <StarSolid className="h-20 rating__icon--star rating__icon"/>
        </label>
        <input className="rating__input" name="rating" id="rating-3" value="3" type="radio" checked={checked === 3}
               onChange={_handleChange}/>
        <label aria-label="4 stars" className="rating__label" htmlFor="rating-4">
          <StarSolid className="h-20 rating__icon--star rating__icon"/>
        </label>
        <input className="rating__input" name="rating" id="rating-4" value="4" type="radio" checked={checked === 4}
               onChange={_handleChange}/>
        <label aria-label="5 stars" className="rating__label" htmlFor="rating-5">
          <StarSolid className="h-20 rating__icon--star rating__icon"/>
        </label>
        <input className="rating__input" name="rating" id="rating-5" value="5" type="radio" checked={checked === 5}
               onChange={_handleChange}/>
      </div>
      <p className="text-muted font-italic">Vous pouvez attribuer une note à votre commande afin d'orienté les autres utilisateurs sur la qualité des produits du restaurant.</p>
    </div>
  );
};

export default React.memo(Rating);
