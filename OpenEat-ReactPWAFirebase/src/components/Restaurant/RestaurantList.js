import React, { useEffect, useState, useMemo } from "react";
import { getRestaurants } from "../../firebase";
import Restaurant from "../Restaurant/Restaurant";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Fuse from "fuse.js";
import GridLoader from "../Utils/GridLoader";

const RestaurantList = ({ bookmarks, setBookmarks, isLoading }) => {

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [maxRestaurant, setMaxRestaurant] = useState(false);
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreRestaurants);
  const [lastDocument, setLastDocument] = useState(undefined);

  const fuse = useMemo(
    () =>
      new Fuse(restaurants, {
        keys: ["name"],
        includeScore: true,
        shouldSort: true,
      }),
    [restaurants],
  );

  const filteredRestaurant = search === "" ? restaurants : fuse.search(search)
    .filter((result) => result.score < 0.5)
    .map(restaurant => restaurant.item);

  function fetchMoreRestaurants () {
    getRestaurants(lastDocument)
      .then(function (queryRestaurants) {
        if (queryRestaurants.docs.length !== 0) {
          setLastDocument(queryRestaurants.docs[queryRestaurants.docs.length - 1]);
          setRestaurants(prevState => ([
            ...prevState,
            ...queryRestaurants.docs.map((restaurant) => {
              return { id: restaurant.id, ...restaurant.data() };
            }),
          ]));
        } else {
          setMaxRestaurant(true);
        }
        setIsFetching(false);
      });
  }

  const _handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchMoreRestaurants();
  }, []);

  return (
    <>
      <header>
        <div className="container d-flex align-items-center justify-content-center flex-column">
          <div className="w-100 mb-5">
            <h1 className="text-white display-3 font-weight-bold mb-3">Open Eat</h1>
            <p className="text-white font-italic">On peut dire qu'on fait comme UberEats mais avec moins de
              fonctionnalités</p>
          </div>
          <div className="card w-100">
            <div className="card-body">
              <h2 className="h3 mb-4">Trouver le restaurant qui correpondra à vos attentes</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Rechercher un restaurant"
                         aria-label="Recherche un restaurant" defaultValue={search}
                         onChange={_handleSearch}/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>
      <div className="container">
        {search.length > 0 &&
        <section>
          <h2 className="h1 title-bordered">Resultat de votre recherche</h2>
          {filteredRestaurant.length === 0 && <p>Aucun restaurant trouvé</p>}
          <div className="row">
            {filteredRestaurant.map(restaurant =>
              <Restaurant key={"search-"+restaurant.id} restaurant={restaurant} bookmarks={bookmarks}
                          setBookmarks={setBookmarks}/>,
            )}
          </div>
        </section>
        }
        {search.length === 0 &&
        <>
          {isLoading && <GridLoader className="w-100 loader-mt"/>}
          {!isLoading && bookmarks.length > 0 &&
            <section>
              <h2 className="h1 title-bordered">Vos restaurants favoris</h2>
              <div className="row">
                {bookmarks.map(restaurant =>
                  <Restaurant key={"fav-"+restaurant.id} restaurant={restaurant} bookmarks={bookmarks}
                              setBookmarks={setBookmarks}/>,
                )}
              </div>
            </section>
          }
          <section>
            <h2 className="h1 title-bordered">Nos meilleurs restaurants</h2>
            {!isFetching && restaurants.length === 0 && <GridLoader className="w-100 loader-mt"/>}
            <div className="row">
              {restaurants.filter(restaurant => restaurant.rate !== undefined).map(restaurant =>
                <Restaurant key={"better-"+restaurant.id} restaurant={restaurant} bookmarks={bookmarks}
                            setBookmarks={setBookmarks}/>,
              ).sort((prev, next) => {
                return next.props.restaurant.rate - prev.props.restaurant.rate;
              })}
            </div>
          </section>
          <section>
            <h2 className="h1 title-bordered">Nos restaurants</h2>
            {!isFetching && restaurants.length === 0 && <GridLoader className="w-100 loader-mt"/>}
            <div className="row">
              {filteredRestaurant.map(restaurant =>
                <Restaurant key={restaurant.id} restaurant={restaurant} bookmarks={bookmarks}
                            setBookmarks={setBookmarks}/>,
              )}
            </div>
            {isFetching && !maxRestaurant && <GridLoader className="w-100 loader-mt"/>}
          </section>
        </>
        }
      </div>
    </>);

};

export default RestaurantList;
