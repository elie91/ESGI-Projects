import React, {useState} from "react";
import CustomAvatar from "../../../Custom/CustomAvatar";
import {Button, Divider, ListItemIcon, Menu, MenuItem, Typography} from "@material-ui/core";
import {generateTags} from "../../../../helpers/Utils";
import clsx from "clsx";
import CustomIconButton from "../../../Custom/Button/CustomIconButton";
import { FileCopy } from "@material-ui/icons";
import VideoComments from "../Comment/VideoComments";
import {useSnackbar} from "notistack";
import {useGlobalStyles} from "../../../../config/theme";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../../context/AuthContext";
import {makeStyles} from "@material-ui/core/styles";
import {useLocation} from "react-router-dom";
import useVideos from "../../../../hooks/useVideos";

const useStyles = makeStyles(theme => ({
  avatar: {
    height: 60,
    width: 60,
    marginRight: theme.spacing(2),
  },
  allButtons: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
  },
}));

const Right = ({video, videoId}) => {

  const globalStyles = useGlobalStyles();
  const classes = useStyles();
  const {t} = useTranslation();
  const {user} = useAuth();
  const {pathname} = useLocation();
  const {enqueueSnackbar} = useSnackbar();
  const {actions: videosActions} = useVideos();

  const [anchorEl, setAnchorEl] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(null);
  const [isLiked, setIsLiked] = useState(video.hasLiked && video.hasLiked !== "0");
  const [isFollowed, setIsFollowed] = useState(video.hasFollowed && video.hasFollowed !== "0");
  const [likesCount, setLikesCount] = useState(video.likes.length);

  const handleLike = () => {
    if (!user) {
      enqueueSnackbar(t("like.pleaseSignin"), {variant: "error"});
      return;
    }
    const temp = !isLiked;
    videosActions.likeVideo(video.id)
        .then(() => setIsLiked(temp))
        .then(() => setLikesCount(prev => temp ? prev + 1 : prev - 1))
  }

  const handleFollow = () => {
    if (!user) {
      enqueueSnackbar(t("follow.pleaseSignin"), {variant: "error"});
      return;
    }
    const temp = !isFollowed;
    videosActions.followPlayer(video.id)
        .then(() => setIsFollowed(temp))
  }

  const open = Boolean(anchorEl);


  const copyToClipboard = (event) => {
    navigator.clipboard.writeText(event.target.innerText)
        .then(() => {
          setAnchorEl(null);
          enqueueSnackbar(t("copied"), {variant: "info"});
        });
  };

  return (
    <>
      <div className={globalStyles.justifyBetween}>
        <div className={globalStyles.alignItemsCenter}>
          <CustomAvatar user={video.user} className={classes.avatar}/>
          <div>
            <Typography variant="h6">{video.user.lastname}</Typography>
            <Typography variant="subtitle1">{video.user.firstname}</Typography>
          </div>
        </div>
        <Button variant="outlined" color="primary" onClick={handleFollow}>
          {user && isFollowed ? t("subscriptions.subscriber") : t("subscriptions.subscribe")}
        </Button>
      </div>
      <Divider className={globalStyles.mt2}/>
      <Typography variant="subtitle1">{video.title}</Typography>
      <Typography variant="body2" className={globalStyles.fontWeight600}>
        {generateTags(video)}
      </Typography>
      <div className={clsx(globalStyles.alignItemsCenter, classes.allButtons)}>
        <CustomIconButton
          inline
          isActive={user && isLiked}
          icon="like"
          text={likesCount}
          ariaLabel="likes"
          onClick={handleLike}
        />
        <CustomIconButton
          inline
          icon="comment"
          text={commentsCount}
          ariaLabel="comments"
          clickable={false}
        />
        <CustomIconButton
          inline
          icon="view"
          text={video.views.length}
          ariaLabel="views"
          clickable={false}
        />
        <CustomIconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-haspopup="true"
          inline
          icon="share"
          ariaLabel="share"
        />
        <Menu
          d="share-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
            },
          }}
        >
          <MenuItem onClick={copyToClipboard}>
            <ListItemIcon>
              <FileCopy fontSize="small"/>
            </ListItemIcon>
            <Typography variant="body2">
              {`${window.location.origin}${pathname}`}
            </Typography>
          </MenuItem>
        </Menu>
      </div>
      <VideoComments
        videoId={videoId}
        comments={comments}
        setComments={setComments}
        setCommentsCount={setCommentsCount}
      />
    </>
  );
};

export default Right;
