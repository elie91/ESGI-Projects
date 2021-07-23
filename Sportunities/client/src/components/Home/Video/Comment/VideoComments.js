import React, {useCallback, useEffect, useRef, useState} from "react";
import {Typography} from "@material-ui/core";
import CommentItem from "./CommentItem";
import {makeStyles} from "@material-ui/core/styles";
import useVideos from "../../../../hooks/useVideos";
import AddComment from "./AddComment";
import {useAuth} from "../../../../context/AuthContext";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {useGlobalStyles} from "../../../../config/theme";

const useStyles = makeStyles((theme) => ({
  commentSection: {
    flexGrow: 1,
    overflow: "hidden auto",
  },
  addComment: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

const VideoComments = ({videoId, comments, setComments, setCommentsCount}) => {

  const {actions: videosActions} = useVideos();
  const classes = useStyles();
  const globalStyles = useGlobalStyles();

  const observer = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const commentSectionRef = useRef(null);

  const {user} = useAuth();
  const {t} = useTranslation();
  const {enqueueSnackbar} = useSnackbar();


  useEffect(() => {
    videosActions.getVideoComments(videoId, 1)
        .then(data => {
          setComments(data.rows);
          setCommentsCount(data.count);
          setHasMore(data.count > data.rows.length);
        })
        .then(() => setIsLoading(false))
  }, [videoId]);

  const lastElementRef = useCallback(
      (node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            videosActions.getVideoComments(videoId, pageNumber + 1)
                .then((data) => {
                  setPageNumber(prev => prev + 1);
                  const tempArray = [...comments, ...data.rows];
                  setComments(tempArray);
                  setCommentsCount(data.count);
                  setHasMore(data.count > tempArray.length);
                })
          }
        });
        if (node) observer.current.observe(node);
      },
      [isLoading, hasMore],
  );


  const addComment = async (value) => {
    if (value.length === 0) return;
    if (!user) {
      enqueueSnackbar(t("comments.pleaseSignin"), {variant: "error"});
      return;
    }
    videosActions.commentVideo(videoId, {comment: value})
        .then((data) => {
          setComments([data.comment, ...comments, ]);
          setCommentsCount(prev => prev + 1);
        })
        .then(() => {
          commentSectionRef.current.scrollTop = 0;
        });
  };


  return (
      <>
        <Typography variant="h6" gutterBottom>{t("comments.title")}</Typography>
        <div className={classes.commentSection} ref={commentSectionRef}>
          {comments.length > 0 ? (
              comments.map((comment, index) => {
                if (comments.length === index + 1) {
                  return (
                      <CommentItem key={index} comment={comment} innerRef={lastElementRef}/>
                  );
                } else {
                  return <CommentItem key={index} comment={comment}/>;
                }
              })
          ) : (
              <Typography className={globalStyles.mt1}>{t("comments.empty")}</Typography>
          )}
        </div>
        <div className={classes.addComment}>
          <AddComment onSubmit={addComment}/>
        </div>
      </>
  );

};

export default VideoComments;
