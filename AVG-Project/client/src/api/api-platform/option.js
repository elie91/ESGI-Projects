import {API_OPTIONS} from "../../../config/entrypoint";
import {request} from "@/utils";

export const getOptions = async (params = []) => {
  return await request(API_OPTIONS, {
    withMetadata: true,
    query: params,
  });
};

export const getOption = async (id) => {
  return await request(`${API_OPTIONS}`, {id});
};

export const createOption = async (values) => {
  return await request(API_OPTIONS, {
    method: "POST",
    body: {
      name: values.name
    },
  });
};

export const editOption = async (values) => {
  return await request(API_OPTIONS, {
    method: "PUT",
    id: values.id,
    body: {
      name: values.name
    },
  });
};

export const deleteOption = async (id) => {
  return await request(`${API_OPTIONS}/${id}`, {
    method: "DELETE",
  });
};
