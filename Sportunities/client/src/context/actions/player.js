import Request from "../../helpers/RequestHelper";
import { API_PLAYERS, API_PLAYERS_FAMOUS } from "../../config/entrypoint";

export const REQUEST_PLAYERS = "REQUEST_PLAYERS";
export const RECEIVE_PLAYERS = "RECEIVE_PLAYERS";
export const RECEIVE_UPDATE_PLAYERS = "RECEIVE_UPDATE_PLAYERS";

export const REQUEST_PLAYERS_FAMOUS = "REQUEST_PLAYERS_FAMOUS";
export const RECEIVE_PLAYERS_FAMOUS = "RECEIVE_PLAYERS_FAMOUS";

export const addPlayer = (values) => Request.request(API_PLAYERS, {
  method: "POST",
  body: values,
});

export function fetchPlayers (params) {
  return Request.request(API_PLAYERS, {
    query: params,
  });
}

export function fetchPlayer (id) {
  return Request.request(`${API_PLAYERS}/${id}`);
}

export function updatePlayer (values) {
  return Request.request(API_PLAYERS, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}

export function fetchFamousPlayers (params) {
  return Request.request(API_PLAYERS_FAMOUS, {
    query: params,
  });
}
