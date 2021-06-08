import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
//import Unsplash, { toJson } from "unsplash-js";

//const unsplash = new Unsplash({ accessKey: "jgZIQxAculYyGyHLciUe8f4egjkAv5eCysGQ_9VO65w" });

//const faker = require("faker");

const firebaseConfig = {
  apiKey: "AIzaSyCITl4WVnbq3aLH7MJgo4xe8sOC39NYMOM",
  authDomain: "openeat-c6da8.firebaseapp.com",
  databaseURL: "https://openeat-c6da8.firebaseio.com",
  projectId: "openeat-c6da8",
  storageBucket: "openeat-c6da8.appspot.com",
  messagingSenderId: "923279635608",
  appId: "1:923279635608:web:4983814ba89f80dd730ced",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
});
firebase.firestore().enablePersistence()
  .catch(function (err) {
    if (err.code === "failed-precondition") {
      console.log("Close other tabs");
    } else if (err.code === "unimplemented") {
      console.log("Go chrome bro");
    }
  });
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email } = user;
    try {
      await userRef.set({
        email,
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

export const getRestaurants = async (last) => {
  if (last) {
    return firestore.collection("restaurants")
      .orderBy("name")
      .startAfter(last)
      .limit(15).get();
  } else {
    const collection = firestore.collection("restaurants").orderBy("name");
    return collection.limit(15).get();
  }
};

export const getRestaurant = async (id) => {
  return firestore.collection("restaurants").doc(id).get();
};

export const getRestaurantProducts = async restaurantId => {
  return firestore.collection("restaurants").doc(restaurantId)
    .collection("products").get();
};

export const getRestaurantComments = async restaurantId => {
  return firestore.collection("restaurants").doc(restaurantId)
    .collection("comments").orderBy("comment_date", "desc").get();
};

export const getBookmarks = async (user) => {
  return firestore.collection("users").doc(user.uid)
    .collection("bookmarks").get();
};

export const addBookmark = async (restaurant, user) => {
  return firestore.collection("users").doc(user.uid)
    .collection("bookmarks").doc(restaurant.id)
    .set(restaurant);
};

export const removeBookmark = async (restaurant, user) => {
  return firestore.collection("users").doc(user.uid)
    .collection("bookmarks").doc(restaurant.id)
    .delete();
};

export const getOrders = async (user) => {
  return firestore.collection("users").doc(user.uid)
    .collection("orders")
    .orderBy("date", "desc")
    .get();
};

export const getOrder = async (id, user) => {
  return firestore.collection("users").doc(user.uid)
    .collection("orders").doc(id).get();
};

export const getOrderProducts = async (id, user) => {
  return firestore.collection("users").doc(user.uid)
    .collection("orders").doc(id)
    .collection("products").get();
};

export const createOrder = async (user, cartItems) => {
  return firestore.collection("restaurants").doc(cartItems[0].restaurant.id).collection("orders").add({
    date: new Date(),
  }).then(function (doc) {
    cartItems.forEach(function (item) {
      firestore.collection("restaurants")
        .doc(cartItems[0].restaurant.id).collection("orders")
        .doc(doc.id).collection("products").doc(item.id).set({ name: item.name, quantity: item.quantity });
    });
    firestore.collection("users").doc(user.uid).collection("orders").doc(doc.id)
      .set({ date: new Date(), restaurant: cartItems[0].restaurant }).then(function () {
      cartItems.forEach(function (item) {
        firestore.collection("users")
          .doc(user.uid).collection("orders")
          .doc(doc.id).collection("products").doc(item.id).set({ name: item.name, quantity: item.quantity });
      });
    });
  });
};

export const rateOrder = async (order, user, rate) => {
  let _order = {
    rate: rate,
    date: order.date,
  };

  if (order.comment) {
    _order.comment = order.comment;
  }

  return firestore.collection("restaurants").doc(order.restaurant.id)
    .collection("orders").doc(order.id).set(_order).then(function () {
      let _order = {
        rate: rate,
        date: order.date,
        restaurant: order.restaurant,
      };
      if (order.comment) {
        _order.comment = order.comment;
      }
      firestore.collection("users").doc(user.uid).collection("orders").doc(order.id).set(_order);
    });
};

export const commentOrder = async (order, user, comment) => {

  let _order = {
    date: order.date,
    comment: comment,
    lastname: user.lastname,
    firstname: user.firstname,
    comment_date: new Date(),
  };
  if (order.rate) {
    _order.rate = order.rate;
  }
  return firestore.collection("restaurants").doc(order.restaurant.id)
    .collection("orders").doc(order.id)
    .set(_order)
    .then(function () {
      let _order = {
        date: order.date,
        restaurant: order.restaurant,
        comment: comment,
        comment_date: new Date(),
      };
      if (order.rate) {
        _order.rate = order.rate;
      }
      firestore.collection("users").doc(user.uid)
        .collection("orders").doc(order.id).set(_order);

      firestore.collection("restaurants").doc(order.restaurant.id)
        .collection("comments").add({
        comment: comment,
        lastname: user.lastname,
        firstname: user.firstname,
        comment_date: new Date(),
      });
    });
};

/*export const addRestaurant = async () => {
  return getImage().then((value) => {
    return firestore.collection("restaurants")
      .add({ name: faker.company.companyName("name.lastName"), image: value }).then(function (doc) {
        for (let i = 0; i < 3; i++) {
          firestore.collection("restaurants").doc(doc.id).collection("products")
            .add({ name: faker.commerce.productName() });
        }
      });
  })

};*/

// export const getImage = () => {
//   return unsplash.search.photos("food", 1, 30, { orientation: "landscape" })
//     .then(toJson)
//     .then(json => {
//       return json.results[Math.floor(Math.random() * Math.floor(30))].urls.small
//     });
// }
