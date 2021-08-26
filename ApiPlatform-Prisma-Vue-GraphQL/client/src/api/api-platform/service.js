import {API_SERVICES} from "../../../config/entrypoint";
import {request} from "@/utils";

export const getServices = async (params = []) => {
  return await request(API_SERVICES, {
    withMetadata: true,
    query: params,
  });
};

export const getService = async (id) => {
  return await request(`${API_SERVICES}`, {id});
};

export const createService = async (values) => {
  return await request(API_SERVICES, {
    method: "POST",
    body: {
      name: values.name,
      price: parseInt(values.price, 10)
    },
  });
};

export const editService = async (values) => {
  return await request(API_SERVICES, {
    method: "PUT",
    id: values.id,
    body: {
      name: values.name,
      price: parseInt(values.price, 10)
    },
  });
};

export const deleteService = async (id) => {
  return await request(`${API_SERVICES}/${id}`, {
    method: "DELETE",
  });
};
