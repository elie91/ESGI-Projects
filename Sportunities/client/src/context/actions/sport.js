import Request from "../../helpers/RequestHelper";
import { API_SPORTS } from "../../config/entrypoint";

export const REQUEST_SPORTS = "REQUEST_SPORTS";
export const RECEIVE_SPORTS = "RECEIVE_SPORTS";
export const RECEIVE_ADD_SPORTS = "RECEIVE_ADD_SPORTS";
export const RECEIVE_UPDATE_SPORTS = "RECEIVE_UPDATE_SPORTS";
export const RECEIVE_DELETE_SPORTS = "RECEIVE_DELETE_SPORTS";

export function fetchSports (params) {
  return Request.request(API_SPORTS, {
    query: params,
  });
}

export const addSport = (values) => Request.request(API_SPORTS, {
  method: "POST",
  body: values,
});

export function fetchSport (id) {
  return Request.request(`${API_SPORTS}/${id}`);
}

export function updateSport (values) {
  return Request.request(API_SPORTS, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}

export const deleteSport = (id) => Request.request(`${API_SPORTS}/${id}`, {
  method: "DELETE",
});
