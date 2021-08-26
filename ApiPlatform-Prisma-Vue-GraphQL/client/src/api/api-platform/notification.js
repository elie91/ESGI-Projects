import { API_NOTIFICATIONS, API_PLATFORM_ENDPOINT } from "../../../config/entrypoint";
import { request } from "@/utils";

export const getNotifications = async (params = {}) => {
  return await request(
    params.next ? `${API_PLATFORM_ENDPOINT}${params.next}` : API_NOTIFICATIONS,
    {
      withMetadata: true,
      query: params,
    },
  );
};

export const editNotification = async (values) => {
  return await request(API_NOTIFICATIONS, {
    method: "PUT",
    id: values.id,
    body: {
      viewed: true,
    },
  });
};
