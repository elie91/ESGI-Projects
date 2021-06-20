import Request from "../../helpers/RequestHelper";
import { API_STATIONS, API_STATIONS_GRAPH } from "../../config/entrypoints";

export const REQUEST_STATIONS = "REQUEST_STATIONS";
export const RECEIVE_STATIONS = "RECEIVE_STATIONS";
export const CLEAR_STATIONS = "CLEAR_STATIONS";

export function fetchStations (params) {
  return Request.request(API_STATIONS, {
    query: params,
  });
}

export function fetchStation (id) {
  return Request.request(`${API_STATIONS}/${id}`);
}

export function fetchStationGraph (params) {
  return Request.request(API_STATIONS_GRAPH.replace(':id', params.id).replace(':date', params.date));
}


