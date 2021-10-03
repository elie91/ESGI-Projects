import Request from "../../helpers/RequestHelper";
import { API_VIDEOS } from "../../config/entrypoint";

export const REQUEST_VIDEOS_PLAYER_FOLLOWED = "REQUEST_VIDEOS_PLAYER_FOLLOWED";
export const RECEIVE_VIDEOS_PLAYER_FOLLOWED = "RECEIVE_VIDEOS_PLAYER_FOLLOWED";
export const VIDEOS_PLAYER_FOLLOWED_PAGE = "VIDEOS_PLAYER_FOLLOWED_PAGE";

export function fetchVideosPlayerFollowed (params) {
  return Request.request(`${API_VIDEOS}/following`, {
    method: "GET",
    query: params,
  });
}

