import Unsplash, { toJson } from "unsplash-js";
const unsplash = new Unsplash({ accessKey: "jgZIQxAculYyGyHLciUe8f4egjkAv5eCysGQ_9VO65w" });
const faker = require("faker");

const getImage = (id) => {
    return unsplash.search.photos("animals", 1, 30, { orientation: "landscape" })
      .then(toJson)
      .then(json => {
          return json.results[id].urls.small
      });
}

export const fetchProducts = async () => {
    let products;
    if (localStorage.getItem('products')){
        products = JSON.parse(localStorage.getItem('products'));
    }else{
        products = [];
        for (let i = 0; i < 30; i++) {
            products.push({
                name: faker.name.firstName(),
                price: faker.commerce.price(),
                image: await getImage(i)
            });
        }
        localStorage.setItem('products', JSON.stringify(products));
    }
    return new Promise((resolve, reject) => {
            resolve(products);
    });
}
