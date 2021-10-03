import React, { useEffect } from "react";
import { Card, CardContent, List, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import usePlayer from "../../hooks/usePlayer";
import { formatErrors } from "../../helpers/Utils";
import { useSnackbar } from "notistack";
import Item from "./Famous/Item";

const useStyles = makeStyles(() => ({
  list: {
    height: "70vh",
    overflowY: "scroll",
  }
}));

const RecommendedPlayers = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { actions, selectors } = usePlayer();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    actions.getFamousPlayers()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, []);

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography align="center" variant="h6">{t("recommendedPlayers.title")}</Typography>
      </CardContent>
      <List className={classes.list}>
        {selectors.getFamousPlayers().map((player, index) =>
          <Item key={index} player={player}/>,
        )}
      </List>
    </Card>
  );
};

export default RecommendedPlayers;
