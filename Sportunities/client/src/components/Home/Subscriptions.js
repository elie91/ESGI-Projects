import React, {useCallback, useEffect, useRef, useState} from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { Subscriptions as SubscriptionsIcon } from "@material-ui/icons";
import { useGlobalStyles } from "../../config/theme";
import { useHistory } from "react-router-dom";
import { RT_LOGIN } from "../../config/routes";
import { useTranslation } from "react-i18next";
import VideoItem from "./Video/VideoItem";
import VideoItemLoader from "./Video/VideoItemLoader";
import { formatErrors } from "../../helpers/Utils";
import { useSnackbar } from "notistack";
import useSubscriptions from "../../hooks/useSubscriptions";

const useStyles = makeStyles((theme) => ({
  subscriptionIcon: {
    fontSize: 100,
    color: theme.palette.grey.main,
  },
  container: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Subscriptions = () => {

  const observer = useRef(null);
  const { user } = useAuth();
  const classes = useStyles();
  const history = useHistory();
  const globalStyles = useGlobalStyles();
  const { t } = useTranslation();
  const { actions: actionsSubscription, selectors: selectorsSubscription } = useSubscriptions();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);


  useEffect(() => {
    if (!user) return;
    actionsSubscription.fetchVideos(null, true)
        .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, []);

  const lastElementRef = useCallback(
      (node) => {
        if (selectorsSubscription.isLoading()) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver( async (entries) => {
          if (entries[0].isIntersecting && selectorsSubscription.getLength() < selectorsSubscription.getMetadata().count) {
            await actionsSubscription.fetchVideos({
              page: page + 1,
            }).then(() => {
              setPage(prev => prev + 1);
            })
                .catch(e => formatErrors(e, null, enqueueSnackbar));
          }
        });
        if (node) observer.current.observe(node);
      },
      [selectorsSubscription.getLength()],
  );

  const emptyMessage = useCallback((emptyType) => {
    return (
      <Container maxWidth="md" className={classes.container}>
        <SubscriptionsIcon className={classes.subscriptionIcon}/>
        <Typography variant="h5" className={globalStyles.mt4}>
          {emptyType === "emptyFollows" ? t("subscriptions.emptyFollows.mainTitle") : t("subscriptions.notConnected.mainTitle")}
        </Typography>
        <Typography className={globalStyles.mt1}>
          {emptyType === "emptyFollows" ? t("subscriptions.emptyFollows.secondaryTitle") : t("subscriptions.notConnected.secondaryTitle")}
        </Typography>
        {emptyType === "emptyUser" && (
          <Button
            onClick={() => history.push(RT_LOGIN)}
            variant="contained"
            color="primary"
            className={globalStyles.mt5}>
            {t("security.signin")}
          </Button>
        )}

      </Container>
    );
  }, []);

  if (!user) {
    return emptyMessage("emptyUser");
  }
  if (!selectorsSubscription.isLoading() && selectorsSubscription.getVideos().length === 0) {
    return emptyMessage("emptyFollows");
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {selectorsSubscription.getVideos().map((video, index) => {
            if (selectorsSubscription.getVideos().length === index + 1) {
              return (
                <VideoItem innerRef={lastElementRef} video={video} key={index}/>
              );
            } else {
              return <VideoItem video={video} key={index}/>;
            }
          })}
          {selectorsSubscription.isLoading() && Array.from(Array(5), (_, x) => x).map((item, index) =>
            <VideoItemLoader key={index}/>,
          )}
        </Grid>
      </Grid>
    </Container>
  );

};

export default Subscriptions;
