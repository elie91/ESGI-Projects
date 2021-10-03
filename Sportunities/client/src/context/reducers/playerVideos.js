import { playerVideosActions } from "../actions/playerVideos";
import { formatVideoData } from "../../helpers/Utils";

export const initialState = {
  videos: [],
  metadata: {
    count: 0,
    page: 1,
  },
  uploading: false,
  loading: false,
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case playerVideosActions.FETCH_PLAYER_VIDEOS_START:
      return {
        ...state,
        loading: true,
      };

    case playerVideosActions.FETCH_PLAYER_VIDEOS_SUCCESS:

      const formatData = action.payload.videos.map(video => formatVideoData(video));

      return {
        ...state,
        videos: action.payload.metadata.page > 1 ? [...state.videos, ...formatData] : formatData,
        metadata: {
          count: action.payload.metadata.count,
          page: action.payload.metadata.page,
        },
        loading: false,
      };

    case playerVideosActions.UPLOAD_VIDEO_START:
      return {
        ...state,
        uploading: true,
      };

    case playerVideosActions.UPLOAD_VIDEO_SUCCESS:
      return {
        ...state,
        uploading: false,
        videos: [...state.videos, formatVideoData(action.payload)],
      };

    case playerVideosActions.DELETE_VIDEO_SUCCESS:
      return {
        ...state,
        videos: state.videos.filter(video => video.id !== action.payload.id),
      };

    case playerVideosActions.UPDATE_VIDEO_SUCCESS:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id === action.payload.video.id) {
            video = formatVideoData(action.payload.video);
          }
          return video;
        }),
      };

    case playerVideosActions.UPLOAD_VIDEO_ERROR:
    case playerVideosActions.UPDATE_VIDEO_ERROR:
      return {
        ...state,
        uploading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
