import { useContext } from "react";
import { RootContext } from "../context/RootContext";
import {
  fetchVideosPlayerFollowed,
  REQUEST_VIDEOS_PLAYER_FOLLOWED,
  RECEIVE_VIDEOS_PLAYER_FOLLOWED,
  VIDEOS_PLAYER_FOLLOWED_PAGE,
} from "../context/actions/subscriptions";

const useSubscriptions = () => {
  const {
    state: { subscriptions: subscriptionsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    fetchVideos: async (params, reset = false) => {
      if (subscriptionsState.loading) {
        return false;
      }
      dispatch({ type: REQUEST_VIDEOS_PLAYER_FOLLOWED });

      const subscriptions = await fetchVideosPlayerFollowed(params);

      dispatch({
        type: RECEIVE_VIDEOS_PLAYER_FOLLOWED,
        payload: {
          subscriptions: subscriptions,
          reset
        },
      });

      return subscriptions;
    },
    setPage: (page) => {
      dispatch({
        type: VIDEOS_PLAYER_FOLLOWED_PAGE,
        payload: { page },
      });
    },
  };

  const selectors = {
    getVideos: () => subscriptionsState.subscriptions,
    getLength: () => subscriptionsState.subscriptions.length,
    isLoading: () => subscriptionsState.loading,
    isEmpty: () => subscriptionsState.subscriptions.length === 0,
    getMetadata: () => {
      return subscriptionsState.metadata;
    },
    getScrollY: () => subscriptionsState.scrollY,
  };

  return { actions, selectors };
};

export default useSubscriptions;
