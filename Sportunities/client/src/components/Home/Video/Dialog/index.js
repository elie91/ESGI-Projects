import React, {useCallback, useEffect, useRef, useState} from "react";
import Transition from "../../../Custom/Transition/Transition";
import { Dialog, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { API_VIDEOS } from "../../../../config/entrypoint";
import CustomIconButton from "../../../Custom/Button/CustomIconButton";
import {formatErrors, formatUrlPlayerVideo} from "../../../../helpers/Utils";
import {useHistory, useParams} from "react-router-dom";
import useVideos from "../../../../hooks/useVideos";
import SpinLoader from "../../../Custom/SpinLoader";
import {useAuth} from "../../../../context/AuthContext";
import useAddVideoView from "../../../../hooks/useAddVideoView";
import Right from "./Right";
import {RT_ROOT} from "../../../../config/routes";
import {useSnackbar} from "notistack";

const useStyles = makeStyles(theme => ({
  subscribeButton: {
    textAlign: "right",
  },
  container: {
    height: "100%",
  },
  videoWrapper: {
    background: theme.palette.primary.main,
    height: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
    },
  },
  video: {
    margin: "0 auto",
    height: "100vh",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
      marginTop: theme.spacing(8),

    },
  },
  videoPadding: {
    padding: theme.spacing(0, 4),
  },
  info: {
    position: "relative",
    height: "100%",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  closeIcon: {
    color: "white",
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(1),
    zIndex: 10,
  },
  containerArrows: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: theme.spacing(1),
    zIndex: 10,
    color: "white",
  },
}));

const VideoDialog = () => {

  const classes = useStyles();

  const videoPlayerRef = useRef(null);
  const [loadMore, setLoadMore] = useState(false);
  const [displayNext, setDisplayNext] = useState(false);
  const [displayPrevious, setDisplayPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState({});
  const {selectors: videosSelectors, actions: videosActions} = useVideos();
  const {user} = useAuth();
  const history = useHistory();
  const {videoId} = useParams();
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    setIsLoading(true);
    videosActions.fetchVideo(videoId)
        .then(data => {
          setVideo(data);
          setIsLoading(false);
        })
        .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, [videoId]);

  const {setIsVideoPlaying} = useAddVideoView({
    ref: videoPlayerRef,
    percentage: 30,
    callback: () => videosActions.addVideoView(video.id).then((data) => setVideo({...video, views: [...video.views, data.view]}))
  });

  const findVideo = () => videosSelectors.getVideos().findIndex(v => v.id === video.id);

  const pushHistory = useCallback((nextVideo) => {
    return history.push(formatUrlPlayerVideo(nextVideo));
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (loadMore) {
      const nextIndex = findVideo() + 1;
      const nextVideo = videosSelectors.getVideos()[nextIndex];
      !isCancelled && setLoadMore(false);
      return pushHistory(nextVideo);
    }
    return () => {
      isCancelled = true;
    };
  }, [loadMore]);

  useEffect(() => {
    if (!video) return;
    let isCancelled = false;
    const currentIndex = findVideo();
    if (currentIndex === -1) return;
    if (!isCancelled) {
      if (currentIndex > 0) {
        setDisplayPrevious(true);
      }
      (currentIndex + 1 === videosSelectors.getLength() && videosSelectors.getLength() < videosSelectors.getMetadata().count) ? setDisplayNext(false) : setDisplayNext(true);
    }
    return () => {
      isCancelled = true;
    };
  }, [video]);

  const onNextVideo = async () => {
    const currentIndex = findVideo();

    if (currentIndex === -1) {
      const nextVideo = videosSelectors.getVideos()[0];
      if (nextVideo) {
        return pushHistory(nextVideo);
      }
    }
    const nextIndex = findVideo() + 1;
    if (nextIndex === videosSelectors.getLength() && videosSelectors.hasMore()) {
      const pageNumber = videosSelectors.getMetadata().page;
      videosActions.fetchVideos({
        page: pageNumber + 1,
        owner_id: user.id,
      }).then(() => setLoadMore(true));
    } else {
      if (videosSelectors.isEmpty()) {
        // On sait pas quoi faire
        console.log("Not After");
      } else {
        const nextVideo = videosSelectors.getVideos()[nextIndex];
        return pushHistory(nextVideo);
      }
    }
  };

  const onPreviousVideo = () => {
    const currentIndex = findVideo();
    if (currentIndex === -1) {
      if (videosSelectors.isEmpty()) {
        console.log("Not previous");
        return;
      } else {
        const nextVideo = videosSelectors.getVideos()[0];
        return pushHistory(nextVideo);
      }

    }
    const nextIndex = findVideo() - 1;
    const nextVideo = videosSelectors.getVideos()[nextIndex];
    return pushHistory(nextVideo);
  };

  const onClose = () => {
    if (history.location.state && history.location.state.origin) {
      return history.push(history.location.state.origin);
    }
    return history.push(RT_ROOT);
  };

  if (isLoading) {
    return <SpinLoader/>;
  } else {
    return (
      <Dialog
        fullScreen
        open={true}
        TransitionComponent={Transition}
      >
        <Grid container className={classes.container}>
          <Grid item sm={8} xs={12} className={classes.videoWrapper}>
            <CustomIconButton
              fontSize="large"
              icon="close"
              ariaLabel="close"
              className={classes.closeIcon}
              onClick={onClose}
            />
            <div className={classes.containerArrows}>
              {displayPrevious && (
                <CustomIconButton
                  fontSize="large"
                  color="inherit"
                  inline={false}
                  icon="previous"
                  ariaLabel="close"
                  onClick={onPreviousVideo}
                />
              )}
              {displayNext && (
                <CustomIconButton
                  fontSize="large"
                  spacingBottom={false}
                  color="inherit"
                  inline={false}
                  icon="next"
                  ariaLabel="close"
                  onClick={onNextVideo}
                />

              )}
            </div>
            <video
              playsInline
              ref={videoPlayerRef}
              src={`${API_VIDEOS}/${video.id}/play`}
              title={video.title}
              className={classes.video}
              controls
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              autoPlay
              loop
            />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.info}>
            <Right video={video} videoId={videoId}/>
          </Grid>
        </Grid>
      </Dialog>
    );
  }

};

export default VideoDialog;
