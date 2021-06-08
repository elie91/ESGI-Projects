import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../actions/products.ts";
import type { Router } from "../deps.ts";

export default function productRoutes(router: Router) {
  return router
    .post("/products", addProduct)
    .get("/products/:id", getProduct)
    .put("/products/:id", updateProduct)
    .delete("/products/:id", deleteProduct)
    .get("/products", getProducts);
}
