import { useContext } from "react";
import { RootContext } from "../context/RootContext";
import {
  fetchVideos,
  addVideoComment,
  addView,
  likeVideo,
  followPlayer,
  getVideoComments,
  fetchVideo,
  REQUEST_VIDEOS,
  RECEIVE_VIDEOS,
  SCROLL_POSITION_VIDEO,
  ADD_LIKE_VIDEO,
  REMOVE_LIKE_VIDEO,
  ADD_FOLLOW_VIDEO,
  REMOVE_FOLLOW_VIDEO,
  COMMENT_VIDEO,
  ADD_VIDEO_VIEW,
} from "../context/actions/videos";

const useVideos = () => {
  const {
    state: { videos: videosState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    fetchVideos: async (params) => {
      if (videosState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_VIDEOS });

      const videos = await fetchVideos(params);

      dispatch({
        type: RECEIVE_VIDEOS,
        payload: {
          videos: videos.rows,
          metadata: {
            count: videos.count,
            page: params && params.page ? params.page : 1
          },
        },
      });

      return videos;
    },
    setScrollPosition: (value) => {
      dispatch({
        type: SCROLL_POSITION_VIDEO,
        payload: {
          scrollPosition: value,
        },
      });
    },
    fetchVideo: (id) => fetchVideo(id),
    commentVideo: (id, comment) => {
      return addVideoComment(id, comment)
        .then(data => {
          dispatch({
            type: COMMENT_VIDEO,
            payload: {
              comment: data.comment,
            },
          });
          return data;
        })
        .catch(err => console.log(err));
    },
    addVideoView: (id) => {
      return addView(id)
        .then(data => {
          dispatch({
            type: ADD_VIDEO_VIEW,
            payload: {
              view: data.view,
            },
          });
          return data;
        });
    },
    likeVideo: (id) => {
      return likeVideo(id)
        .then((data) => {
          if (data.add_like) {
            dispatch({
              type: ADD_LIKE_VIDEO,
              payload: {
                add_like: data.add_like,
              },
            });
          }
          if (data.remove_like) {
            dispatch({
              type: REMOVE_LIKE_VIDEO,
              payload: {
                remove_like: data.remove_like,
              },
            });
          }
        })
        .catch(err => console.log(err));
    },
    followPlayer: (id) => {
      return followPlayer(id)
        .then(data => {
          if (data.add_follow) {
            dispatch({
              type: ADD_FOLLOW_VIDEO,
              payload: {
                followed: data.add_follow,
              },
            });
          }
          if (data.remove_follow) {
            dispatch({
              type: REMOVE_FOLLOW_VIDEO,
              payload: {
                not_followed: data.remove_follow,
              },
            });
          }
        })
        .catch(err => console.log(err));
    },
    getVideoComments: (videoId, pageNumber) => getVideoComments(videoId, pageNumber),
  };

  const selectors = {
    getVideos: () => videosState.videos,
    getLength: () => videosState.videos.length,
    getScrollPosition: () => videosState.scrollPosition,
    isLoading: () => videosState.loading,
    isEmpty: () => videosState.videos.length === 0,
    getMetadata: () => videosState.metadata,
  };

  return { actions, selectors };
};

export default useVideos;
