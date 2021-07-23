import Request from "../../helpers/RequestHelper";
import { API_AGENTS } from "../../config/entrypoint";

export const REQUEST_AGENTS = "REQUEST_AGENTS";
export const RECEIVE_AGENTS = "RECEIVE_AGENTS";
export const RECEIVE_UPDATE_AGENTS = "RECEIVE_UPDATE_AGENTS";

export const addAgent = (values) => Request.request(API_AGENTS, {
  method: "POST",
  body: values,
});

export function fetchAgents (params) {
  return Request.request(API_AGENTS, {
    query: params,
  });
}

export function fetchAgent (id) {
  return Request.request(`${API_AGENTS}/${id}`);
}

export function updateAgent (values) {
  return Request.request(API_AGENTS, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}
