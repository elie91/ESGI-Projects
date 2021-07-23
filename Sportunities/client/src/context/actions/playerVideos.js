import Request from "../../helpers/RequestHelper";
import {API_VIDEOS} from "../../config/entrypoint";

export const playerVideosActions = {
    FETCH_PLAYER_VIDEOS_START: "FETCH_PLAYER_VIDEOS_START",
    FETCH_PLAYER_VIDEOS_SUCCESS: "FETCH_PLAYER_VIDEOS_SUCCESS",
    UPLOAD_VIDEO_START: "UPLOAD_VIDEO_START",
    UPLOAD_VIDEO_SUCCESS: "UPLOAD_VIDEO_SUCCESS",
    UPLOAD_VIDEO_ERROR: "UPLOAD_VIDEO_ERROR",
    DELETE_VIDEO_SUCCESS: "DELETE_VIDEO_SUCCESS",
    UPDATE_VIDEO_SUCCESS: "UPDATE_VIDEO_SUCCESS",
    UPDATE_VIDEO_ERROR: "UPDATE_VIDEO_ERROR",
}

export function fetchPlayerVideos(params) {
    return Request.request(API_VIDEOS, {
        query: params,
    });
}

export function fetchPlayerVideo(id) {
    return Request.request(`${API_VIDEOS}/${id}`);
}

export function uploadVideo(values) {
    return Request.request(API_VIDEOS, {
        method: "POST",
        body: values,
        headers: {},
    })
}
export function updateVideoAction (values) {
    return Request.request(API_VIDEOS, {
        method: "PUT",
        id: values.id,
        body: values,
    });
}

export function deleteVideo(id) {
    return Request.request(`${API_VIDEOS}/${id}`, {
        method: "DELETE"
    })
}
