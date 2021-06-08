export const ENDPOINTS = [
  {
    label: "api-platform",
    image: "api-platform.svg",
    url: process.env.VUE_APP_API_PLATFORM_ENTRYPOINT,
  },
  {
    label: "prisma",
    image: "prisma.png",
    url: process.env.VUE_APP_PRISMA_ENTRYPOINT,
  },
];

export const API_PLATFORM_ENDPOINT = ENDPOINTS[0].url;
export const PRISMA_ENDPOINT = ENDPOINTS[1].url;

export const API_LOGIN = API_PLATFORM_ENDPOINT + "/login_check";
export const API_USERS = API_PLATFORM_ENDPOINT + "/users";
export const API_HOMES = API_PLATFORM_ENDPOINT + "/homes";
export const API_NOTIFICATIONS = API_PLATFORM_ENDPOINT + "/notifications";
export const API_RENTS = API_PLATFORM_ENDPOINT + "/rents";
export const API_EVENTS = API_PLATFORM_ENDPOINT + "/events";
export const API_EVENT_USERS = API_PLATFORM_ENDPOINT + "/event_users";
export const API_SERVICES = API_PLATFORM_ENDPOINT + "/services";
export const API_OPTIONS = API_PLATFORM_ENDPOINT + "/options";
