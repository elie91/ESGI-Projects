import React, { useEffect } from "react";
import { Button, Grid } from "@material-ui/core";
import { useGlobalStyles } from "../../../config/theme";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { RT_PLAYER_SHOW_VIDEOS } from "../../../config/routes";
import clsx from "clsx";
import { formatErrors, formatUrlPlayer } from "../../../helpers/Utils";
import { useSnackbar } from "notistack";
import usePlayerVideos from "../../../hooks/usePlayerVideos";
import CardVideo from "./CardVideo";

const Videos = ({ player }) => {
  const globalClasses = useGlobalStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { actions, selectors } = usePlayerVideos();

  useEffect(() => {
    if (player) {
      actions.fetchVideos({
        owner_id: player.user.id,
      })
        .catch(e => formatErrors(e, null, enqueueSnackbar));
    }

  }, [player]);

  return (
    <div className={globalClasses.mt2}>
      <Grid container spacing={1}>
        {selectors.getVideos().slice(0, 4).map((video, index) =>
          <Grid key={index} item sm={3} xs={12}>
            <CardVideo video={video}/>
          </Grid>,
        )}
      </Grid>
      {!selectors.isEmpty() &&
      <div className={clsx(globalClasses.textCenter, globalClasses.mt2)}>
        <Button
          color="primary"
          variant="text"
          onClick={() => history.push(formatUrlPlayer(player.user, player, RT_PLAYER_SHOW_VIDEOS))}>
          {t("player.video.more")}
        </Button>
      </div>
      }
    </div>
  );
};

export default Videos;
