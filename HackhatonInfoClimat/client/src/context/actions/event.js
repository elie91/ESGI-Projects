import Request from "../../helpers/RequestHelper";
import {API_EVENTS, API_EVENTS_HISTORIC_VALUES} from "../../config/entrypoints";

export const REQUEST_EVENTS = "REQUEST_EVENTS";
export const RECEIVE_EVENTS = "RECEIVE_EVENTS";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";

export function fetchEvents (params) {
  return Request.request(API_EVENTS, {
    query: params,
  });
}

export function fetchEventsByHistoricValues (params) {
  return Request.request(API_EVENTS_HISTORIC_VALUES, {
    query: params,
  });
}

export function fetchEvent (id) {
  return Request.request(`${API_EVENTS}/${id}`);
}

export function fetchEventValues (id) {
  return Request.request(`${API_EVENTS}/${id}/values`);
}

