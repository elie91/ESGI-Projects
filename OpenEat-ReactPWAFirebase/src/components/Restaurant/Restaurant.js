import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as AddFavIcon } from "../../images/heart-regular.svg";
import { ReactComponent as FavIcon } from "../../images/heart-solid.svg";
import { Link } from "react-router-dom";
import { addBookmark, removeBookmark } from "../../firebase";
import UserContext from "../../context/UserContext";
import { ReactComponent as StarSolid } from "../../images/star-solid.svg";

const Restaurant = ({ restaurant, bookmarks, setBookmarks }) => {

  const { user } = useContext(UserContext);
  const [bookmarked, setBookmarked] = useState(false);
  const _handleBookmark = (type) => {
    if (type === "add") {
      setBookmarked(true);
      setBookmarks(prev => [restaurant, ...prev]);
      addBookmark(restaurant, user).then(function () {
        console.log("Bookmarks added");
      });
    } else {
      setBookmarked(false);
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== restaurant.id));
      removeBookmark(restaurant, user).then(function () {
        console.log("Bookmarks removed");
      });
    }
  };

  useEffect(() => {
    setBookmarked(bookmarks.find(bookmark => bookmark.id === restaurant.id));
  }, [bookmarks, restaurant]);

  return (
    <div className="col-md-4 col-sm-6 col-12 mb-4">
      <div className="card h-100 position-relative">
        <Link to={"/restaurants/" + restaurant.id}>
          {restaurant.image && <img className="img-fluid" src={restaurant.image} alt={restaurant.name + "-thumb"}/>}
        </Link>
        <div className="card-body">
          <div className="d-flex flex-column justify-content-between h-100">
            <Link to={"/restaurants/" + restaurant.id}>
              <h2 className="text-dark mr-3">{restaurant.name}</h2>
            </Link>
            {user &&
            <button className="position-absolute btn fav-icon"
                    onClick={() => _handleBookmark(bookmarked ? "remove" : "add")}>
              {bookmarked ? <FavIcon className="icon"/> : <AddFavIcon
                className="icon"/>}
            </button>
            }
            {restaurant.rate ? (
              <div className="d-flex align-items-center justify-content-end">
                <StarSolid className="h-20 text-orange"/>
                <span className="ml-2">{restaurant.rate.toFixed(1)}</span>
              </div>
            ) : <div className="text-right text-muted">Pas de note</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
