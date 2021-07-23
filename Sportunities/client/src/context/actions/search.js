import Request from "../../helpers/RequestHelper";
import { API_SEARCH } from "../../config/entrypoint";

export function fetchSearch (params) {
  return Request.request(API_SEARCH, {
    query: params,
  });
}
