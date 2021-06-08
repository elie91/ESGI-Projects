import { API_EVENT_USERS, API_PLATFORM_ENDPOINT } from "../../../config/entrypoint";
import { request } from "@/utils";

export const getEventUsers = async (params = []) => {
  return await request(
    params.next ? `${API_PLATFORM_ENDPOINT}${params.next}` : API_EVENT_USERS,
    {
      withMetadata: true,
      query: params,
    }
  );
};

export const createEventUser = async (values) => {
  return await request(API_EVENT_USERS, {
    method: "POST",
    body: values,
  });
};

export const deleteEventUser = async (id) => {
  return await request(`${API_EVENT_USERS}/${id}`, {
    method: "DELETE",
  });
};
