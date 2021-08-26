const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();
const ALGOLIA_ID = "T2B52KJ5OO";
const ALGOLIA_ADMIN_KEY = "17fdf7d10eba67e5f387bcfd64e014e3";
const ALGOLIA_INDEX_NAME = 'restaurants';
const algoliasearch = require('algoliasearch');
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

exports.avergageRatingRestaurant = functions.firestore.document("/restaurants/{restaurantId}/orders/{orderId}")
  .onUpdate((change, context) => {
    return firestore.collection("restaurants").doc(context.params.restaurantId).get().then( (restaurant) => {
      return firestore.collection("restaurants").doc(restaurant.id).collection("orders")
        .orderBy("rate").get().then((querySnapshotOrder) => {
          let rate = 0;
          let count = 0;
          querySnapshotOrder.forEach((order) => {
            rate += order.data().rate;
            count++;
          });
          functions.logger.log("Average Rating :", {rate, count});

          return firestore.collection("restaurants").doc(context.params.restaurantId).set({
            rate: rate / count,
          }, { merge: true })
        });
    })
  });

/*exports.onRestaurantCreated = functions.firestore.document("restaurants/{restaurantId}").onCreate((snap, context) => {
  const restaurant = snap.data();
  restaurant.objectID = context.params.restaurantId;
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.saveObject(restaurant).then(({ objectID }) => {
    functions.logger.log("Index Added :", objectID);
    return true;
  }).catch((err) => {
    functions.logger.log("Error :", err);
    return false;
  });
});*/
