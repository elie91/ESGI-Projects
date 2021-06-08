import { API_LOGIN, API_USERS } from "../../../config/entrypoint";
import { request } from "@/utils";

export const signIn = async (values) => {
  return await request(API_LOGIN, {
    method: "POST",
    body: values,
  });
};

export const signUp = async (values, apollo = undefined) => {
  return await request(API_USERS, {
    method: "POST",
    body: values,
  });
};
