import Request from "../../helpers/RequestHelper";
import { API_POSITIONS } from "../../config/entrypoint";

export const REQUEST_POSITIONS = "REQUEST_POSITIONS";
export const RECEIVE_POSITIONS = "RECEIVE_POSITIONS";
export const RECEIVE_ADD_POSITIONS = "RECEIVE_ADD_POSITIONS";
export const RECEIVE_UPDATE_POSITIONS = "RECEIVE_UPDATE_POSITIONS";
export const RECEIVE_DELETE_POSITIONS = "RECEIVE_DELETE_POSITIONS";

export function fetchPositions (params) {
  return Request.request(API_POSITIONS, {
    query: params,
  });
}

export const addPosition = (values) => Request.request(API_POSITIONS, {
  method: "POST",
  body: values,
});

export function fetchPosition (id) {
  return Request.request(`${API_POSITIONS}/${id}`);
}

export function updatePosition (values) {
  return Request.request(API_POSITIONS, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}

export const deletePosition = (id) => Request.request(`${API_POSITIONS}/${id}`, {
  method: "DELETE",
});
