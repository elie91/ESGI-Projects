import {API_USERS} from "../../../config/entrypoint";
import {request} from "@/utils";

export const getUsers = async (params = []) => {
  return await request(API_USERS, {
    withMetadata: true,
    query: params,
  });
};

export const getUser = async (id) => {
  return await request(`${API_USERS}`, {id});
};

export const createUser = async (values) => {
  return await request(API_USERS, {
    method: "POST",
    body: {
      email: values.email,
      lastname: values.lastname,
      firstname: values.firstname,
      phone: values.phone,
      roles: values.roles,
      plainPassword: values.plainPassword,
    },
  });
};

export const editUser = async (values) => {
  return await request(API_USERS, {
    method: "PUT",
    id: values.id,
    body: {
      email: values.email,
      lastname: values.lastname,
      firstname: values.firstname,
      phone: values.phone,
      roles: values.roles,
    },
  });
};

export const deleteUser = async (id) => {
  return await request(`${API_USERS}/${id}`, {
    method: "DELETE",
  });
};
