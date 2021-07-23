import Request from "../../helpers/RequestHelper";
import { API_CLUBS } from "../../config/entrypoint";

export const REQUEST_CLUBS = "REQUEST_CLUBS";
export const RECEIVE_CLUBS = "RECEIVE_CLUBS";
export const RECEIVE_ADD_CLUBS = "RECEIVE_ADD_CLUBS";
export const RECEIVE_UPDATE_CLUBS = "RECEIVE_UPDATE_CLUBS";
export const RECEIVE_DELETE_CLUBS = "RECEIVE_DELETE_CLUBS";

export function fetchClubs (params) {
  return Request.request(API_CLUBS, {
    query: params,
  });
}

export const addClub = (values) => Request.request(API_CLUBS, {
  method: "POST",
  body: values,
});

export function fetchClub (id) {
  return Request.request(`${API_CLUBS}/${id}`);
}

export function updateClub (values) {
  return Request.request(API_CLUBS, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}

export const deleteClub = (id) => Request.request(`${API_CLUBS}/${id}`, {
  method: "DELETE",
});
