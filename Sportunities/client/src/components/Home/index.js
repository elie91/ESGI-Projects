import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Grid, useMediaQuery, useTheme } from "@material-ui/core";
import VideoItem from "./Video/VideoItem";
import useVideos from "../../hooks/useVideos";
import { formatErrors } from "../../helpers/Utils";
import { useSnackbar } from "notistack";
import VideoItemLoader from "./Video/VideoItemLoader";
import RecommendedPlayers from "./RecommendedPlayers";
import { makeStyles } from "@material-ui/core/styles";
import Filters from "./Video/Filters";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "sticky",
    top: 80,
    zIndex: 10,
  },
}));

const Home = () => {

  const { selectors, actions } = useVideos();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("lg"));
  const classes = useStyles();

  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (selectors.isLoading()) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && selectors.getLength() < selectors.getMetadata().count) {
          await actions.fetchVideos({
            page: page + 1,
          }).then(() => {
            setPage(prev => prev + 1);
          })
            .catch(e => formatErrors(e, null, enqueueSnackbar));
        }
      });
      if (node) observer.current.observe(node);
    },
    [selectors.getLength()],
  );

  useEffect(() => {
    actions.fetchVideos({ page: 1 })

      .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, []);

  useEffect(() => {
    if (selectors.getScrollPosition() !== 0) {
      window.scroll({
        top: selectors.getScrollPosition(),
        left: 0,
      });
    }
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          <Filters/>
          {selectors.isLoading() && Array.from(Array(5), (_, x) => x).map((item, index) =>
            <VideoItemLoader key={index}/>,
          )}
          {selectors.getVideos().map((video, index) => {
            if (selectors.getLength() === index + 1) {
              return (
                <VideoItem innerRef={lastElementRef} video={video} key={index}/>
              );
            } else {
              return <VideoItem video={video} key={index}/>;
            }
          })}
        </Grid>
        {mobile &&
        <Grid item sm={4} xs={12}>
          <div className={classes.container}>
            <RecommendedPlayers/>
          </div>
        </Grid>
        }
      </Grid>
    </Container>

  );
};

export default Home;
