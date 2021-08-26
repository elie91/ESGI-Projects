import { API_EVENTS, API_PLATFORM_ENDPOINT } from "../../../config/entrypoint";
import { request } from "@/utils";
import { format } from "date-fns";

export const getEvents = async (params = {}) => {
  let formattedParams = { ...params };
  if (formattedParams.startDate) {
    formattedParams = {
      ...formattedParams,
      startDate: { after: format(formattedParams.startDate.after, "yyyy-MM-dd") },
    };
  }
  return await request(formattedParams.next ? `${API_PLATFORM_ENDPOINT}${formattedParams.next}` : API_EVENTS, {
    withMetadata: true,
    query: formattedParams,
  });
};

export const getEvent = async (id) => {
  return await request(`${API_EVENTS}`, { id });
};

export const createEvent = async (values) => {
  return await request(API_EVENTS, {
    method: "POST",
    body: {
      ...values,
      peopleLimit: +values.peopleLimit,
    },
  });
};

export const editEvent = async (values) => {
  return await request(API_EVENTS, {
    method: "PUT",
    id: values.id,
    body: {
      rent_id: values.rent_id,
      name: values.name,
      peopleLimit: +values.peopleLimit,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
    },
  });
};

export const updateStatus = async (values) => {
  return await request(`${API_EVENTS}/${values.id}/status`, {
    method: "POST",
    body: {
      status: values.status
    }
  })
}

export const deleteEvent = async (id) => {
  return await request(`${API_EVENTS}/${id}`, {
    method: "DELETE",
  });
};
