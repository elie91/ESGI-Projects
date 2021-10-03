import React, { useEffect, useState } from "react";
import { Grid, IconButton, makeStyles } from "@material-ui/core";
import AdminPage from "../../Custom/AdminPage";
import CardPlayer from "../../Custom/CardPlayer";
import usePlayer from "../../../hooks/usePlayer";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import Filters from "./Filters";
import { DRAWER_FILTER_WIDTH } from "../../../config/constant";
import { FilterList } from "@material-ui/icons";
import LoaderGenerator from "../../Custom/Loaders/LoaderGenerator";
import { formatErrors } from "../../../helpers/Utils";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    marginRight: -DRAWER_FILTER_WIDTH,
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
    },

  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

const Players = () => {

  const { selectors, actions } = usePlayer();
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    actions.getPlayers()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AdminPage
      title={t("agent.listPlayer")}
      rightButton={<IconButton color="primary" onClick={handleDrawerOpen}><FilterList/></IconButton>}>
      <div className={classes.root}>
        <main className={clsx(classes.content, { [classes.contentShift]: open })}>
          <Grid container spacing={2}>
            {selectors.isLoading() &&
            <LoaderGenerator
              rounded
              height={250}
              needContainer={false}
              number={9}
              itemPerRow={{ xs: 12, sm: 4, md: 4 }}/>
            }

            {!selectors.isLoading() && selectors.getPlayers().map((player, index) =>
              <Grid item xs={12} sm={4} md={4} key={index}>
                <CardPlayer player={player}/>
              </Grid>,
            )}
          </Grid>
        </main>
        <Filters handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} open={open}/>
      </div>

    </AdminPage>
  );
};

export default Players;
