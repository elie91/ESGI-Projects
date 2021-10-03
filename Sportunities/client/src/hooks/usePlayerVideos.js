import { useContext } from "react";
import { RootContext } from "../context/RootContext";
import { playerVideosActions, fetchPlayerVideos, fetchPlayerVideo, updateVideoAction, uploadVideo, deleteVideo } from "../context/actions/playerVideos";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const usePlayerVideos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const {
    state: { playerVideos: playerVideosState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    fetchVideos: async (params) => {
      if (playerVideosState.loading) {
        return false;
      }

      dispatch({ type: playerVideosActions.FETCH_PLAYER_VIDEOS_START });

      const videos = await fetchPlayerVideos(params);

      dispatch({
        type: playerVideosActions.FETCH_PLAYER_VIDEOS_SUCCESS,
        payload: {
          videos: videos.rows,
          metadata: {
            count: videos.count,
            page: params.page ? params.page : 1,
          },
        },
      });

      return videos;
    },
    fetchVideo: async id => await fetchPlayerVideo(id),
    uploadVideoAction: async values => {

      if (playerVideosState.uploading) {
        return false;
      }

      dispatch({ type: playerVideosActions.UPLOAD_VIDEO_START });
      enqueueSnackbar(t("video.uploadProgress"), { variant: "info" });
      await uploadVideo(values)
    },
    uploadVideoEnd: async video => {
      enqueueSnackbar(t("video.uploadProgressSuccess"), { variant: "info" });
      return dispatch({
        type: playerVideosActions.UPLOAD_VIDEO_SUCCESS,
        payload: video
      })
    },
    uploadVideoError: async err => {
      enqueueSnackbar(t("video.uploadProgressFailure"), { variant: "error" });
      return dispatch({
        type: playerVideosActions.UPLOAD_VIDEO_ERROR,
        payload: err
      })
    },
    updateVideo: async values => {
      return updateVideoAction(values)
        .then(video => {
          dispatch({
            type: playerVideosActions.UPDATE_VIDEO_SUCCESS,
            payload: {
              video
            },
          });
        })
    },
    deleteVideo: async (id) => {
      return deleteVideo(id)
        .then(() => {
          dispatch({
            type: playerVideosActions.DELETE_VIDEO_SUCCESS,
            payload: { id: id },
          });
        })
        .then(() => enqueueSnackbar(t("video.deleteSuccess"), { variant: "info" }))
    }
  }


  const selectors = {
    getVideos: () => playerVideosState.videos,
    isLoading: () => playerVideosState.loading,
    isUploading: () => playerVideosState.uploading,
    isEmpty: () => playerVideosState.videos.length === 0,
    getMetadata: () => playerVideosState.metadata,
  }

  return { actions, selectors };
}

export default usePlayerVideos;
