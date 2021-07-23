import Request from "../../helpers/RequestHelper";
import { API_EXPERIENCES } from "../../config/entrypoint";

export const REQUEST_EXPERIENCES = "REQUEST_EXPERIENCES";
export const RECEIVE_EXPERIENCES = "RECEIVE_EXPERIENCES";
export const RECEIVE_ADD_EXPERIENCES = "RECEIVE_ADD_EXPERIENCES";
export const RECEIVE_DELETE_EXPERIENCES = "RECEIVE_DELETE_EXPERIENCES";
export const RECEIVE_UPDATE_EXPERIENCES = "RECEIVE_UPDATE_EXPERIENCES";

export function fetchExperiences (params) {
    return Request.request(API_EXPERIENCES, {
        query: params,
    });
}

export const addExperience = (values) => Request.request(API_EXPERIENCES, {
    method: "POST",
    body: values,
});

export function fetchExperience (id) {
    return Request.request(`${API_EXPERIENCES}/${id}`);
}

export function updateExperience (values) {
    return Request.request(API_EXPERIENCES, {
        method: "PUT",
        id: values.id,
        body: values,
    });
}

export const deleteExperience = (id) => Request.request(`${API_EXPERIENCES}/${id}`, {
    method: "DELETE",
});
