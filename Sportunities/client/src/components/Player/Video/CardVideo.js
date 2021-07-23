import React, { useCallback } from "react";
import { API_VIDEOS } from "../../../config/entrypoint";
import { makeStyles } from "@material-ui/core/styles";
import useVideos from "../../../hooks/useVideos";
import { useHistory } from "react-router-dom";
import { formatUrlPlayerVideo } from "../../../helpers/Utils";

const useStyles = makeStyles((theme) => ({
  videoPlayer: {
    width: "100%",
    backgroundColor: "#000",
  },
  containerVideo: {
    display: "flex",
    position: "relative",
    cursor: "pointer",
  },
  containerButton: {
    marginLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const CardVideo = ({ video }) => {

    const classes = useStyles();
    const { actions: videosActions } = useVideos();
    const history = useHistory();

    const pushToVideoDialog = useCallback(async () => {
      videosActions.setScrollPosition(window.scrollY);
      history.push(formatUrlPlayerVideo(video), {
        origin: history.location.pathname,
      });

    }, []);

    return (
      <>
        <div onClick={pushToVideoDialog} className={classes.containerVideo}>
          <video
              playsInline
            src={`${API_VIDEOS}/${video.id}/play`}
            title={video.title}
            controls
            muted
            className={classes.videoPlayer}
          />
          {/*<div className={classes.containerButton}>
          <CustomIconButton
            icon={<FavoriteIcon color="primary" fontSize="default"/>}
            text={video.likes}
            ariaLabel="like"
          />
          <CustomIconButton
            icon={<CommentIcon color="primary" fontSize="default"/>}
            text={video.comments}
            ariaLabel="comments"
            onClick={pushToVideoDialog}
          />
          <CustomIconButton
            icon={<VisibilityIcon color="primary" fontSize="default"/>}
            text={video.views}
            ariaLabel="views"
          />
        </div>*/}
        </div>
        {/*<div className={globalClasses.p1}>
        <Typography variant="subtitle1" component="h3">{video.title}</Typography>
        <Typography variant="body2"
                    color="textSecondary">{t("betweenDate", { time: formatDifferenceBetweenDate(new Date(), new Date(video.createdAt))})}</Typography>
      </div>*/}

      </>
    );
  }
;

export default CardVideo;
