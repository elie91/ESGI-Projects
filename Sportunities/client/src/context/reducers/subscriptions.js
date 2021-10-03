import { cutLongText } from "../../helpers/Utils";
import {
  RECEIVE_VIDEOS_PLAYER_FOLLOWED,
  REQUEST_VIDEOS_PLAYER_FOLLOWED,
  VIDEOS_PLAYER_FOLLOWED_PAGE,
} from "../actions/subscriptions";

export const initialState = {
  subscriptions: [],
  loading: false,
  metadata: {
    count: 0,
    page: 1,
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_VIDEOS_PLAYER_FOLLOWED:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_VIDEOS_PLAYER_FOLLOWED:
      const { rows } = action.payload.subscriptions;
      const formatVideos = rows.map(video => {
        return {
          ...video,
          description: cutLongText(video.description, 100),
          comments: video.comments.length,
          likes: video.likes.length,
          views: video.views.length
        }
      });
      return {
        ...state,
        subscriptions: (!action.payload.reset && state.subscriptions.length < state.metadata.count) ? [...state.subscriptions, ...formatVideos] : formatVideos,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
        },
        loading: false,
      };

    case VIDEOS_PLAYER_FOLLOWED_PAGE:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          page: action.payload.page,
        }
      };

    default:
      return state;
  }
};
