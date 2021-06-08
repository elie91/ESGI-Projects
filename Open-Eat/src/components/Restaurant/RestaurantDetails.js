import React, { useContext, useEffect, useState } from "react";
import {
  addBookmark,
  getRestaurant,
  getRestaurantComments,
  getRestaurantProducts,
  removeBookmark,
} from "../../firebase";
import { ReactComponent as AddCartIcon } from "../../images/cart-plus-solid.svg";
import { ReactComponent as EatIcon } from "../../images/utensils-solid.svg";
import { Offline, Online } from "react-detect-offline";
import { addItemToCart, formatDate } from "../Utils/Utils";
import { withRouter } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { ReactComponent as StarSolid } from "../../images/star-solid.svg";
import { ReactComponent as FavIcon } from "../../images/heart-solid.svg";
import { ReactComponent as AddFavIcon } from "../../images/heart-regular.svg";

const RestaurantDetails = ({ match, addToCart, cartItems, bookmarks, setBookmarks }) => {

  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const [comments, setComments] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [bookmarked, setBookmarked] = useState(bookmarks.some(bookmark => bookmark.id === match.params.id));

  const _handleBookmark = (type) => {
    if (type === "add") {
      setBookmarked(true);
      const _bookmarks = bookmarks;
      _bookmarks.push(restaurant);
      setBookmarks(_bookmarks);
      addBookmark(restaurant, user).then(function () {
        console.log("Bookmarks added");
      });
    } else {
      setBookmarked(false);
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== restaurant.id));
      removeBookmark(restaurant, user).then(function () {
        console.log("Bookmarks Removed");
      });
    }
  };

  const _handleClick = (cartItemsToAdd) => {
    // Check if the same restaurant
    if (cartItems.length === 0 || cartItems[cartItems.length - 1].restaurant.id === cartItemsToAdd.restaurant.id) {
      addToCart(addItemToCart(cartItems, cartItemsToAdd));
    } else {
      setCurrentItem(cartItemsToAdd);
      setModal(true);
    }
  };

  const _emptyCart = () => {
    addToCart(addItemToCart([], currentItem));
    setModal(false);
    setCurrentItem({});
  };

  useEffect(() => {
    getRestaurant(match.params.id).then(function (restaurant) {
      setRestaurant({ id: restaurant.id, ...restaurant.data() });
    });
    getRestaurantProducts(match.params.id).then(function (queryProducts) {
      const _products = [];
      queryProducts.forEach(function (product) {
        _products.push({ id: product.id, ...product.data() });
      });
      setProducts(_products);
    });
    getRestaurantComments(match.params.id).then(function (queryProducts) {
      const _comments = [];
      queryProducts.forEach(function (comment) {
        _comments.push({ id: comment.id, ...comment.data() });
      });
      setComments(_comments);
    });
  }, [match.params.id, bookmarks]);

  return (
    <>
      <section className="gradient min-vh-35 d-flex align-items-end">
        <div className="container">
          <div className="card mt-4">
            <div className="card-body">
              <div className="card-title">
                {restaurant &&
                <>
                  <div className="d-flex flex-column flex-md-row justify-content-between">
                    <h1>{restaurant.name}</h1>
                    {user &&
                    <div>
                      <button className="btn fav-icon"
                              onClick={() => _handleBookmark(bookmarked ? "remove" : "add")}>
                        {bookmarked ? <FavIcon className="icon"/> : <AddFavIcon
                          className="icon"/>}
                      </button>
                    </div>
                    }
                  </div>
                  {restaurant.rate ? (
                    <div className="d-flex align-items-center mt-3">
                      Note du restaurant : <StarSolid className="h-20 text-orange ml-2"/>
                      <span className="ml-2">{restaurant.rate.toFixed(1)}</span>
                    </div>
                  ) : <div className="text-right text-muted">Pas de note</div>}
                </>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-2">
        <div className="container">
          <h2 className="title-bordered">Nos produits</h2>
          {products.length > 0 &&
          <div className="row">
            {products.map((product) =>
              <div className="col-md-4 mb-3" key={product.id}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="card-title font-weight-bold d-flex">
                      <EatIcon className="icon mr-3"/>
                      <div>{product.name}</div>
                    </div>
                    <button className="btn btn-primary"
                            onClick={() => _handleClick({
                              id: product.id,
                              name: product.name,
                              restaurant: restaurant,
                            })}>
                      <AddCartIcon className="h-20 mr-2"/> Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>,
            )}
          </div>
          }
          {products.length === 0 &&
          <p>
            <Online>Le restaurant n'a pas de produit disponible</Online>
            <Offline>
              Il semblerait que vous n'êtes pas connecté à Internet. Réessayez plus tard pour voir les produits du restaurant
            </Offline>
          </p>}
          <h2 className="title-bordered mt-5">Nos commentaires</h2>
          {restaurant &&
          <>
            {comments.map((comment) =>
              <div key={comment.id}>
                <div className="p-3">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="comment-avatar d-flex align-items-center justify-content-center">
                        {comment.lastname.substr(0, 1)}{comment.firstname.substr(0, 1)}
                      </div>
                      <b className="ml-2">{comment.lastname} {comment.firstname}</b>
                    </div>
                    <div>
                      <small>{formatDate(comment.comment_date.toDate().toISOString())}</small>
                    </div>
                  </div>
                  <p className="mt-3">{comment.comment}</p>
                </div>
              </div>,
            )}
            {comments.length === 0 &&
            <p>
              <Online>Le restaurant n'a pas de commentaires</Online>
              <Offline>
                Il semblerait que vous n'êtes pas connecté à Internet. Réessayez plus tard pour voir les commentaires du restaurant
              </Offline>
            </p>
            }
          </>
          }
        </div>
        <div className={"modal fade" + (modal ? " show d-block" : "")} id="exampleModal" tabIndex="-1" role="dialog"
             aria-labelledby="exampleModalLabel"
             aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Commencer un nouveau panier ?</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Votre panier contient un plat d'un autre restaurant. Voulez-vous vider votre panier et ajouter le plat ?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                        onClick={() => setModal(false)}>Fermer
                </button>
                <button type="button" className="btn btn-primary" onClick={() => _emptyCart()}>Nouveau panier</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default withRouter(RestaurantDetails);
