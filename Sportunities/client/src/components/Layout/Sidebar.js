import React, { useEffect } from "react";
import {
  Box, Button, Divider,
  Drawer,
  Hidden, IconButton,
  List,
  makeStyles,
  SwipeableDrawer, Typography,
} from "@material-ui/core";
import SidebarItem from "./SidebarItem";
import { drawerWidth, useGlobalStyles } from "../../config/theme";
import CustomAvatar from "../Custom/CustomAvatar";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";
import { RT_AGENT_SHOW, RT_LOGIN, RT_PLAYER_SHOW, RT_PROFILE } from "../../config/routes";
import { ROLE_PLAYER, ROLE_AGENT } from "../../config/constant";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useNavigation from "../../hooks/useNavigation";
import { Close } from "@material-ui/icons";
import { formatUrlPlayer, ucFirst } from "../../helpers/Utils";

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: drawerWidth,
  },
  desktopDrawer: {
    width: drawerWidth,
    height: "calc(100% - " + theme.spacing(8) + "px)",
    border: "none",
    paddingTop: theme.spacing(8),
  },
  box: {
    backgroundColor: theme.palette.info.main,
    paddingTop: theme.spacing(2),
  },
  backButton: {
    backgroundColor: theme.palette.info.main,
    paddingLeft: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  avatar: {
    width: 35,
    height: 35,
  },
  name: {
    fontWeight: 500,
    marginLeft: theme.spacing(1),
  },
  button: {
    textTransform: "initial",
    justifyContent: "flex-start",
  },
}));

const Sidebar = ({ sidebarItems }) => {

  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const { user } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const { actions, selectors } = useNavigation();

  useEffect(() => {
    if (selectors.isOpen()){
      actions.toggleNavigation(false);
    }
  }, [location.pathname]);

  const linkProfile = () => {
    let link = RT_PROFILE;
    if (user) {
      if (user.role.includes(ROLE_PLAYER)) {
        link = formatUrlPlayer(user, user.player, RT_PLAYER_SHOW);
      }
      if (user.role.includes(ROLE_AGENT)) {
        link = RT_AGENT_SHOW.replace(":id", user.agent.id);
      }
    }
    return history.push(link);
  };

  const hasAccess = (item) => {
    let find = false;
    if (item.roles) {
      if (user) {
        let count = 0;
        item.roles.forEach(r => {
          if (user.role.some(ro => ro === r)) {
            count++;
          }
        });
        if (count === 1) {
          find = true;
        }
      }
    } else {
      find = true;
    }
    return find;
  };

  const content = (
    <Box height="100%" display="flex" flexDirection="column" className={classes.box}>
      <Box>
        <List component="nav" disablePadding>
          {sidebarItems.filter(i => hasAccess(i)).map(item => (
            <SidebarItem
              key={item.title}
              icon={item.icon}
              item={item}
            />
          ))}
        </List>
      </Box>
      <div className={classes.grow}/>

      <Box className={globalClasses.p2}>
        <Divider/>
        {user ?
          <Button
            fullWidth
            size="small"
            className={clsx(globalClasses.mr1, classes.button)}
            variant="text"
            color="inherit"
            onClick={linkProfile}
          >
            <CustomAvatar
              className={classes.avatar}
              user={user}
              fontSize={14}
            />
            <Typography className={classes.name}
                        component="span">{ucFirst(user.lastname)} {ucFirst(user.firstname)}</Typography>
          </Button>
          : <Button
            fullWidth
            variant="text"
            color="inherit"
            onClick={() => history.push(RT_LOGIN)}
          >
            {t("security.signin")}
          </Button>}
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <SwipeableDrawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={() => actions.toggleNavigation(false)}
          onOpen={() => actions.toggleNavigation(true)}
          open={selectors.isOpen()}
        >
          <div className={clsx(globalClasses.justifyBetween, classes.backButton)}>
            <Typography variant="h6">Menu</Typography>
            <IconButton color="primary" onClick={() => actions.toggleNavigation(false)}>
              <Close/>
            </IconButton>

          </div>
          {content}
        </SwipeableDrawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default Sidebar;
