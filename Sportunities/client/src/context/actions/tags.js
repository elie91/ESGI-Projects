import Request from "../../helpers/RequestHelper";
import {API_TAGS} from "../../config/entrypoint";


export const tagsActions = {
    FETCH_TAGS_START: "FETCH_TAGS_START",
    FETCH_TAGS_SUCCESS: "FETCH_TAGS_SUCCESS",
}

export function fetchTags (params) {
    return Request.request(API_TAGS, {
        query: params,
    });
}