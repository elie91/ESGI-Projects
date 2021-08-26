export const generateNameRoute = (base, route) => {
  return base + route.replace("/", "_");
};

export const RT_ROOT = "/";

export const RT_FRONT_HOMES = RT_ROOT + "homes";
export const RT_FRONT_HOMES_LOCATION = RT_FRONT_HOMES + "/location";
export const RT_FRONT_EVENTS = RT_ROOT + "events"
export const RT_FRONT_EVENTS_SHOW = RT_FRONT_EVENTS + "/:id"
