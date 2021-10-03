import Request from "../../helpers/RequestHelper";
import { API_USERS } from "../../config/entrypoint";

export const REQUEST_USERS = "REQUEST_USERS";
export const RECEIVE_USERS = "RECEIVE_USERS";
export const RECEIVE_ADD_USERS = "RECEIVE_ADD_USERS";
export const RECEIVE_UPDATE_USERS = "RECEIVE_UPDATE_USERS";
export const RECEIVE_DELETE_USERS = "RECEIVE_DELETE_USERS";

export function fetchUsers (params) {
  return Request.request(API_USERS, {
    query: params,
  });
}

export const addUser = (values) => Request.request(API_USERS, {
  method: "POST",
  body: values,
});

export function fetchUser (id) {
  return Request.request(`${API_USERS}/${id}`);
}

export function updateUser (values) {
  return Request.request(API_USERS, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}

export const deleteUser = (id) => Request.request(`${API_USERS}/${id}`, {
  method: "DELETE",
});
