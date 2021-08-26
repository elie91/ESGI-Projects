import React from "react";
import Restaurant from "../Restaurant/Restaurant";

const BookmarkList = ({ bookmarks, setBookmarks }) => {

  return (
    <div className="container pt-6">
      <h1 className="title-bordered">Mes favoris</h1>
      {bookmarks.length === 0 && <p>Vous n'avez pas encore de favoris</p>}
      {bookmarks.length > 0 &&
        <div className="row">
        {bookmarks.map(restaurant =>
          <Restaurant key={"favorite-"+restaurant.id} restaurant={restaurant} bookmarks={bookmarks}
                      setBookmarks={setBookmarks}/>,
        )}
        </div>
      }
    </div>
  );
};

export default BookmarkList;
