import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatErrors } from "../../../../helpers/Utils";
import { useParams } from "react-router-dom";
import usePlayer from "../../../../hooks/usePlayer";
import { useSnackbar } from "notistack";
import useVideos from "../../../../hooks/useVideos";
import Header from "./Header";
import { Container, Grid } from "@material-ui/core";
import VideoItemLoader from "../../../Home/Video/VideoItemLoader";
import VideoItem from "../../../Home/Video/VideoItem";
import ScrollToTop from "../../../Custom/ScrollToTop";

const AllVideos = () => {

  const { id } = useParams();
  const { actions } = usePlayer();
  const { actions: actionsVideo, selectors: selectorsVideo } = useVideos();
  const [player, setPlayer] = useState(null);
  const [page, setPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let isCancelled = false;
    if (id) {
      const exploded = id.split("-");
      actions.fetchPlayer(exploded[exploded.length - 1])
        .then(result => {
          if (!isCancelled) {
            setPlayer(result);
            actionsVideo.fetchVideos({
              owner_id: result.user.id,
            }).catch(e => formatErrors(e, null, enqueueSnackbar));
          }
        }).catch(e => formatErrors(e, null, enqueueSnackbar));

      return () => {
        isCancelled = true;
      };
    }

  }, []);

  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (selectorsVideo.isLoading()) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && selectorsVideo.getLength() < selectorsVideo.getMetadata().count) {
          await actionsVideo.fetchVideos({
            page: page + 1,
            owner_id: player.user.id,
          }).then(() => {
            setPage(prev => prev + 1);
          })
            .catch(e => formatErrors(e, null, enqueueSnackbar));
        }
      });
      if (node) observer.current.observe(node);
    },
    [selectorsVideo.getLength()],
  );

  return (
    <Container>
      <ScrollToTop/>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Header player={player}/>
        </Grid>
        <Grid item xs={12}>
          {selectorsVideo.isLoading() && Array.from(Array(5), (_, x) => x).map((item, index) =>
            <VideoItemLoader key={index}/>,
          )}
          {selectorsVideo.getVideos().map((video, index) => {
            if (selectorsVideo.getLength() === index + 1) {
              return (
                <VideoItem innerRef={lastElementRef} video={video} key={index}/>
              );
            } else {
              return <VideoItem video={video} key={index}/>;
            }
          })}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AllVideos;
