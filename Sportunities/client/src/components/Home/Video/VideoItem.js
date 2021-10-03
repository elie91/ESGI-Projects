import React, {useCallback, useEffect} from "react";
import {Grid, Typography, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useGlobalStyles} from "../../../config/theme";
import {API_VIDEOS} from "../../../config/entrypoint";
import CustomAvatar from "../../Custom/CustomAvatar";
import useOnScreen from "../../../hooks/useOnScreen";
import CustomIconButton from "../../Custom/Button/CustomIconButton";
import {useTranslation} from "react-i18next";
import {formatUrlPlayer, formatUrlPlayerVideo, generateTags, ucFirst} from "../../../helpers/Utils";
import {useHistory} from "react-router-dom";
import useVideos from "../../../hooks/useVideos";
import useAddVideoView from "../../../hooks/useAddVideoView";
import {RT_PLAYER_SHOW} from "../../../config/routes";
import {useAuth} from "../../../context/AuthContext";
import {useSnackbar} from "notistack";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    borderBottom: "1px solid rgba(22, 24, 35, 0.2)",
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  subscribeButton: {
    textAlign: "right",
  },
  avatar: {
    width: 56,
    height: 56,
    marginRight: theme.spacing(2),
    cursor: "pointer",
  },
  videoInfos: {
    display: "flex",
    alignItems: "center",
    flex: "0.5",
  },
  containerVideo: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  videoPlayer: {
    cursor: "pointer",
    height: "71vh",
    backgroundColor: "#000",
    borderRadius: 10,
    maxWidth: 350,
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      height: "auto",
    },

  },
  containerButton: {
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      marginTop: theme.spacing(2),
      marginLeft: 0,
      paddingBottom: 0,
    },
  },
  button: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(1),
    },
  },
}));

const VideoItem = ({video, innerRef}) => {

  const classes = useStyles();
  const {user} = useAuth();
  const globalStyles = useGlobalStyles();
  const {t} = useTranslation();
  const history = useHistory();
  const {enqueueSnackbar} = useSnackbar();

  const {actions: videosActions} = useVideos();
  const handleLike = async () => {
    if (!user) {
      enqueueSnackbar(t("like.pleaseSignin"), {variant: "error"});
      return;
    }
    await videosActions.likeVideo(video.id);
  };

  const handleFollow = async () => {
    if (!user) {
      enqueueSnackbar(t("follow.pleaseSignin"), {variant: "error"});
      return;
    }
    await videosActions.followPlayer(video.id);
  };

  const [ref, visible] = useOnScreen({
    threshold: 0.7,
  });
  const {setIsVideoPlaying} = useAddVideoView({
    ref: ref,
    percentage: 30,
    callback: () => videosActions.addVideoView(video.id),
  });

  const goToPlayer = () => {
    history.push(formatUrlPlayer(video.user, video.user.player, RT_PLAYER_SHOW));
  };

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      visible ? ref.current.play() : ref.current.pause();
    }
    return () => {
      isCancelled = true;
    };
  }, [visible]);

  const pushToVideoDialog = useCallback(async () => {
    videosActions.setScrollPosition(window.scrollY);
    history.push(formatUrlPlayerVideo(video), {
      origin: history.location.pathname,
    });
  }, []);

  return (
      <Grid item xs ref={innerRef} spacing={2} className={classes.wrapper} container>

        <Grid item sm={8} xs={8}>
          <div className={globalStyles.alignItemsCenter}>
            <CustomAvatar onClick={goToPlayer} user={video.user} className={classes.avatar}/>
            <div className={globalStyles.cursorPointer} onClick={goToPlayer}>
              <Typography variant="h6"
                          component="h3">{`${ucFirst(video.user.lastname)} ${ucFirst(video.user.firstname)}`}</Typography>
              <Typography variant="body2">{video.title} <span
                  className={globalStyles.fontWeight600}>{generateTags(video)}</span></Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={4} sm={4} className={classes.subscribeButton}>
          {(!user || (user && user.id !== video.user.id)) &&
          <Button
              variant="outlined"
              color="primary"
              onClick={handleFollow}
          >
            {user && video.hasFollowed && video.hasFollowed !== "0" ? t("subscriptions.subscriber") : t("subscriptions.subscribe")}
          </Button>
          }
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className={classes.containerVideo}>
            <video
                ref={ref}
                src={`${API_VIDEOS}/${video.id}/play`}
                title={video.title}
                onClick={pushToVideoDialog}
                controls
                muted
                playsInline
                className={classes.videoPlayer}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
            />
            <div className={classes.containerButton}>
              <CustomIconButton
                  isActive={user && video.hasLiked && video.hasLiked !== "0"}
                  icon="like"
                  text={video.likes}
                  ariaLabel="like"
                  onClick={handleLike}
              />
              <CustomIconButton
                  icon="comment"
                  text={Array.isArray(video.comments) ? video.comments.length : video.comments}
                  ariaLabel="comments"
                  onClick={pushToVideoDialog}
              />
              <CustomIconButton
                  clickable={false}
                  icon="view"
                  text={Array.isArray(video.views) ? video.views.length : video.views}
                  ariaLabel="views"
              />
            </div>
          </div>

        </Grid>
      </Grid>
  );
};

export default VideoItem;
