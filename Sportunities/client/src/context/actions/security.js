import Request from "../../helpers/RequestHelper";
import {
  API_HOST,
  API_RESET_PASSWORD,
  API_SIGN_IN,
  API_TOKEN_RESET_PASSWORD,
  API_USERS,
} from "../../config/entrypoint";

export function signIn (email, password) {
  return Request.request(API_SIGN_IN, {
    method: "POST",
    body: { email, password },
  }).then(async (data) => {
    if (data.code === 401) {
      throw new Error(data.message);
    }
    return data.token;
  }).catch((error) => {
    return Promise.reject(error);
  });
}

export function signUp (values) {
  return Request.request(API_USERS, {
    method: "POST",
    body: {
      ...values,
      role: [values.role],
    },
  }).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    return Promise.resolve(result);
  });
}

export function fetchUser (id) {
  return Request.request(`${API_USERS}/${id}`);
}

export function resetPassword (values) {
  return Request.request(API_RESET_PASSWORD, {
    method: "POST",
    body: values,
  });
}

export function tokenResetPassword (values) {
  return Request.request(API_TOKEN_RESET_PASSWORD, {
    method: "POST",
    body: values,
  });
}

export function updateUser (values) {
  return Request.request(API_USERS, {
    method: "PUT",
    id: values.id,
    body: values,
  });
}

export const deleteUser = (id) => Request.request(API_HOST + id, {
  method: "DELETE",
});
