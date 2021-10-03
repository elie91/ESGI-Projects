import {cutLongText} from "../../helpers/Utils";
import {
  RECEIVE_VIDEOS,
  REQUEST_VIDEOS,
  SCROLL_POSITION_VIDEO,
  ADD_FOLLOW_VIDEO,
  REMOVE_FOLLOW_VIDEO,
  ADD_LIKE_VIDEO,
  REMOVE_LIKE_VIDEO,
  COMMENT_VIDEO,
  ADD_VIDEO_VIEW
} from "../actions/videos";

export const initialState = {
  videos: [],
  loading: false,
  error: null,
  hasMore: false,
  scrollPosition: 0,
  metadata: {
    count: 0,
    page: 1,
  },
  filters: {
    sport: "",
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_VIDEOS:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_VIDEOS:
      const formatVideos = action.payload.videos.map(video => {
        return {
          ...video,
          description: cutLongText(video.description, 100),
          comments: video.comments.length,
          likes: video.likes.length,
          views: video.views.length
        }
      })

      return {
        ...state,
        videos: action.payload.metadata.page > 1 ? [...state.videos, ...formatVideos] : formatVideos,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
        },
        loading: false,
      };

    case SCROLL_POSITION_VIDEO:
      return {
        ...state,
        scrollPosition: action.payload.scrollPosition,
      };
    case ADD_FOLLOW_VIDEO:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.user.id === action.payload.followed) {
            video.hasFollowed = '1'
          }
          return video
        })
      };

    case REMOVE_FOLLOW_VIDEO:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.user.id === action.payload.not_followed) {
            video.hasFollowed = '0'
          }
          return video
        })
      };

    case ADD_LIKE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id === action.payload.add_like.video_id) {
            video.hasLiked = '1';
            video.likes = video.likes + 1;
          }
          return video
        })
      };

    case REMOVE_LIKE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id === action.payload.remove_like.video_id) {
            video.hasLiked = '0';
            video.likes = video.likes - 1;
          }
          return video
        })
      };

    case COMMENT_VIDEO:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id === action.payload.comment.video_id) {
            video.comments = video.comments + 1;
          }
          return video
        })
      };

    case ADD_VIDEO_VIEW:
      return {
        ...state,
        videos: state.videos.map(video => {
          if (video.id === action.payload.view.video_id) {
            video.views = video.views + 1;
          }
          return video;
        })
      }

    default:
      return state;
  }
};
