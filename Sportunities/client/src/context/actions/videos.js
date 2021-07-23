import Request from "../../helpers/RequestHelper";
import { API_VIDEOS } from "../../config/entrypoint";

export const REQUEST_VIDEOS = "REQUEST_VIDEOS";
export const ADD_FOLLOW_VIDEO = "ADD_FOLLOW_VIDEO";
export const REMOVE_FOLLOW_VIDEO = "REMOVE_FOLLOW_VIDEO";
export const ADD_LIKE_VIDEO = "ADD_LIKE_VIDEO";
export const REMOVE_LIKE_VIDEO = "REMOVE_LIKE_VIDEO";
export const RECEIVE_VIDEOS = "RECEIVE_VIDEOS";
export const SCROLL_POSITION_VIDEO = "SCROLL_POSITION_VIDEO";
export const COMMENT_VIDEO = "COMMENT_VIDEO";
export const ADD_VIDEO_VIEW = "ADD_VIDEO_VIEW";

export function fetchVideos (params) {
  return Request.request(API_VIDEOS, {
    query: params,
  });
}

export function fetchVideo (videoId) {
  return Request.request(`${API_VIDEOS}/${videoId}`);
}

export function addVideoComment (id, comment) {
  return Request.request(`${API_VIDEOS}/${id}/comments`, {
    method: "POST",
    body: comment,
  });
}

export function addView (id) {
  return Request.request(`${API_VIDEOS}/${id}/views`, {
    method: "POST",
  });
}

export function likeVideo (id) {
  return Request.request(`${API_VIDEOS}/${id}/likes`, {
    method: "POST",
  });
}

export function followPlayer (id) {
  return Request.request(`${API_VIDEOS}/${id}/follows`, {
    method: "POST",
  });
}

export function getVideoComments (videoId, pageNumber) {
  return Request.request(`${API_VIDEOS}/${videoId}/comments`, {
    method: "GET",
    query: { page: pageNumber },
  });
}


