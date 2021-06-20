import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { RT_EVENTS, RT_ROOT } from "../config/routes";
import {
  Button,
  Hidden,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  makeStyles,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import clsx from "clsx";
import { Close, Menu } from "@material-ui/icons";
import { drawerWidth } from "../config/theme";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import Logo from "../assets/images/logo.png";

const useNavigationStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  dropdownAdjust: {
    marginTop: theme.spacing(2),
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  flexTitle: {
    display: "flex",
    alignItems: "center",
  },
  list: {
    width: drawerWidth,
  },
  headerDrawer: {
    paddingTop: theme.spacing(1.6),
    paddingBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
  fabWrapper: {
    position: "relative",
    paddingLeft: "8px",
  },
  fabIcon: {
    height: "24px",
    width: "24px",
    minHeight: "24px",
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -3,
    left: 5,
    zIndex: 1,
  },
  animated: {
    animation: `$rotating 2s linear infinite`,
  },
  "@keyframes rotating": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const Navigation = ({ isMobileNavOpen, setMobileNavOpen }) => {
  const classes = useNavigationStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  return (
    <>
      <div className={classes.grow}>
        <AppBar color="primary" position="fixed" elevation={0} className={classes.appBar}>
          <Toolbar>
            <Hidden smUp>
              <IconButton onClick={() => setMobileNavOpen(!isMobileNavOpen)} edge="start" color="inherit">
                <Menu/>
              </IconButton>
            </Hidden>
            <Button color="inherit" variant="text" onClick={() => history.push(RT_ROOT)}>
              <img src={Logo} height="50" alt="InfoClimat Logo"/>
            </Button>
            <Button color="inherit" type="text" onClick={() => history.push(RT_EVENTS)}>Evenements</Button>
            <div className={classes.grow}/>
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit" onClick={() => console.log("Instagram")}>
                <InstagramIcon/>
              </IconButton>
              <IconButton color="inherit" onClick={() => console.log("Facebook")}>
                <FacebookIcon/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <div
          className={clsx(classes.list)}
          role="presentation"
          onClick={() => setOpen(false)}
          onKeyDown={() => setOpen(false)}
        >
          <div className={clsx(classes.headerDrawer)}>
            <IconButton onClick={() => setOpen(false)} color="inherit">
              <Close/>
            </IconButton>
            <Typography variant="h6" align="center" gutterBottom>{"Item"}</Typography>
          </div>
          <List component="div">
            <ListItem button onClick={() => history.push(RT_ROOT)}>
              <ListItemText primary="Item"/>
            </ListItem>
          </List>
        </div>
        <div className={classes.grow}/>
      </SwipeableDrawer>
    </>
  );
};

export default Navigation;
