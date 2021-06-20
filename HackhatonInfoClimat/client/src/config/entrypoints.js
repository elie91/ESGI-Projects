export const API_HOST = process.env.REACT_APP_API_URL

export const API_PATH = API_HOST + "/";

export const API_EVENTS = API_PATH + "historic-events";
export const API_EVENTS_HISTORIC_VALUES = API_EVENTS + "/filteredvalues";
export const API_STATIONS = API_PATH + "stations";
export const API_STATIONS_GRAPH = API_STATIONS + "/graph/:id/:date";
