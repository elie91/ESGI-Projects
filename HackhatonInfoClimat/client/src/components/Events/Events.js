import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Filters from "../Filters/Filters";
import { makeStyles } from "@material-ui/core/styles";
import EventTable from "../Filters/EventTable";
import clsx from "clsx";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    paddingTop: "8vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "7vh",
    },
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    paddingTop: "8vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "7vh",
    },
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContent: {
    padding: theme.spacing(1),
  },
  drawerTitle: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  drawerHeader: {
    marginTop: "64px",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar

    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    position: "relative",
    flexGrow: 1,
    paddingTop: "8vh",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "7vh",
    },
  },
}));

const Events = () => {

  const classes = useStyles();
  const [open, setOpen] = useState(true);

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        anchor="left"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <Filters open={open} setOpen={setOpen}/>
      </Drawer>
      <main className={classes.content}>
        <EventTable/>
      </main>
    </div>

  );
};

export default Events;
