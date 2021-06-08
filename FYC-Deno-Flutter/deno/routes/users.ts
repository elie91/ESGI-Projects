import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../actions/users.ts";
import type { Router } from "../deps.ts";

export default function userRoutes(router: Router) {
  return router
    .post("/users", addUser)
    .get("/users/:id", getUser)
    .put("/users/:id", updateUser)
    .delete("/users/:id", deleteUser)
    .get("/users", getUsers);
}
