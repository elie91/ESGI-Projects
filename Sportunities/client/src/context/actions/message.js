import Request from "../../helpers/RequestHelper";
import { API_MESSAGES } from "../../config/entrypoint";

export const REQUEST_MESSAGES = "REQUEST_MESSAGES";
export const RECEIVE_MESSAGES = "RECEIVE_MESSAGES";
export const RECEIVE_ADD_MESSAGES = "RECEIVE_ADD_MESSAGES";
export const RECEIVE_DELETE_MESSAGES = "RECEIVE_DELETE_MESSAGES";
export const RECEIVE_UPDATE_MESSAGES = "RECEIVE_UPDATE_MESSAGES";
export const RECEIVE_MERCURE_MESSAGES = "RECEIVE_MERCURE_MESSAGES";

export function fetchMessages (params) {
  return Request.request(API_MESSAGES, {
    query: params,
  });
}

export const addMessage = (values) => Request.request(API_MESSAGES, {
  method: "POST",
  body: values,
});

export function fetchMessage (id) {
  return Request.request(`${API_MESSAGES}/${id}`);
}

export function updateMessage (values) {
  return Request.request(API_MESSAGES, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}

export const deleteMessage = (id) => Request.request(`${API_MESSAGES}/${id}`, {
  method: "DELETE",
});
