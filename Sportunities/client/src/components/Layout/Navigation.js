import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  RT_ADMIN, RT_AGENT_SHOW,
  RT_LOGIN, RT_PLAYER_SHOW,
  RT_PROFILE, RT_ROOT,
  RT_SIGNUP,
} from "../../config/routes";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
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
  CircularProgress,
  Fab, Grid, InputBase,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import clsx from "clsx";
import { Close, Menu, Publish as PublishIcon } from "@material-ui/icons";
import { drawerWidth, useGlobalStyles } from "../../config/theme";
import { ROLE_ADMIN, ROLE_AGENT, ROLE_PLAYER } from "../../config/constant";
import usePlayerVideos from "../../hooks/usePlayerVideos";
import useNavigation from "../../hooks/useNavigation";
import Logo from "../../assets/images/logo-white.png";
import { Autocomplete } from "@material-ui/lab";
import { fetchSearch } from "../../context/actions/search";
import CustomAvatar from "../Custom/CustomAvatar";
import { formatUrlPlayer, formatUrlPlayerVideo } from "../../helpers/Utils";
import useVideos from "../../hooks/useVideos";
import { MERCURE_HUB_URL } from "../../config/entrypoint";

const useNavigationStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    position: "relative",
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
    paddingLeft: theme.spacing(1),
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
  logo: {
    width: 50,
    height: 50,
    cursor: "pointer",
  },
  input: {
    borderRadius: 10,
    padding: theme.spacing(.75, 1),
    backgroundColor: "#ffffff14",
    color: "white",
  },
  right: {
    display: "flex",
    justifyContent: "flex-end",
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

const Navigation = () => {
  const { user, actions } = useAuth();
  const { selectors: playerVideosSelectors, actions: playerVideosActions } = usePlayerVideos();
  const { actions: actionsNavigation, selectors: selectorsNavigation } = useNavigation();
  const { actions: videosActions } = useVideos();
  const classes = useNavigationStyles();
  const globalClasses = useGlobalStyles();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);
  const { t } = useTranslation();
  const history = useHistory();

  const onLogout = () => {
    setOpen(false);
    actions.signOut();
  };

  const onSearch = (e, newValue) => {
    console.log(newValue);
    fetchSearch({ s: e.target.value })
      .then(result => {
        console.log(result);
      });
  };

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetchSearch({ s: inputValue })
      .then(results => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...[...results.videos, ...results.players]];
          }

          setOptions(newOptions);
        }
      });

    return () => {
      active = false;
    };
  }, [value, inputValue]);

  const getOptionLabel = (option) => {
    if (option.title) {
      return option.title;
    } else {
      return option.user.lastname + " " + option.user.firstname;
    }
  };

  const goToItem = (option) => {
    let url = "";
    if (option.title) {
      url = formatUrlPlayerVideo(option);
    } else {
      url = formatUrlPlayer(option.user, option, RT_PLAYER_SHOW);
    }
    setValue(null);
    setInputValue("");
    return history.push(url);

  };


  useEffect(() => {
    if (!user) return;
    const url = new URL(MERCURE_HUB_URL);
    url.searchParams.append("topic", "http://caddy/users/" + user.id + "/videos");
    const eventSource = new EventSource(url);
    eventSource.onmessage = e => {
      if (e.data) {
        let data = JSON.parse(e.data);
        switch (data.entity) {
          case "video":
            switch (data.method) {
              case "post":
                if (data.upload === "end") {
                  playerVideosActions.uploadVideoEnd(data.video);
                  videosActions.fetchVideos();
                } else if (data.upload === "error") {
                  playerVideosActions.uploadVideoError(data.err);
                }
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      }
    };
    return () => {
      eventSource.close();
    };
  }, [user]);


  return (
    <>
      <div className={classes.grow}>
        <AppBar color="primary" position="fixed" elevation={0} className={classes.appBar}>
          <Toolbar>
            <Grid container spacing={1} alignItems="center">
              <Grid item sm={3} xs={3}>
                <div className={globalClasses.alignItemsCenter}>
                  <Hidden lgUp>
                    <IconButton
                      onClick={() => actionsNavigation.toggleNavigation(!selectorsNavigation.isOpen())}
                      edge="start" color="inherit">
                      <Menu/>
                    </IconButton>
                  </Hidden>
                  <img className={classes.logo} src={Logo} alt="Sportunities" onClick={() => history.push(RT_ROOT)}/>
                </div>
              </Grid>

              <Grid item sm={6} xs={8}>
                <Autocomplete
                  id="search"
                  getOptionLabel={getOptionLabel}
                  filterOptions={(x) => x}
                  options={options}
                  includeInputInList
                  filterSelectedOptions
                  value={value}
                  onChange={(event, newValue) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  renderInput={(params) => {
                    const { InputLabelProps, InputProps, ...rest } = params;
                    return <InputBase
                      {...params.InputProps}
                      {...rest}
                      className={classes.input}
                      inputProps={{ ...params.inputProps, placeholder: t("search") }}/>;
                  }}
                  renderOption={(option) => {
                    return (
                      <Grid container alignItems="center" onClick={() => goToItem(option)}>
                        <Grid item xs>
                          <div className={globalClasses.alignItemsCenter}>
                            {!option.title &&
                            <CustomAvatar className={globalClasses.mr1} user={option.user}/>
                            }
                            <Typography variant="body2" color="primary">
                              {getOptionLabel(option)}
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    );
                  }}
                />
              </Grid>

              <Grid item sm={3} xs={1}>
                <div className={classes.right}>
                  {user && user.role.includes(ROLE_ADMIN) &&
                  <Button className={globalClasses.textWhite} color="inherit" size="small" variant="text"
                          onClick={() => history.push(RT_ADMIN)}>
                    {t("navigation.admin")}
                  </Button>
                  }
                  {playerVideosSelectors.isUploading() &&
                  <div className={classes.fabWrapper}>
                    <Fab
                      className={classes.fabIcon}
                      aria-label="save"
                      color="primary"
                    >
                      <PublishIcon color="inherit"/>
                    </Fab>
                    <CircularProgress size={30} className={classes.fabProgress}/>
                  </div>}
                </div>
              </Grid>
            </Grid>
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
          <div className={clsx(globalClasses.relative, classes.headerDrawer)}>
            <IconButton className={globalClasses.topRight} onClick={() => setOpen(false)} color="inherit">
              <Close/>
            </IconButton>
            <Typography variant="h6" align="center" gutterBottom>{t("security.account")}</Typography>
          </div>
          <List component="div" className={globalClasses.mt}>
            {user ?
              <>
                <ListItem button onClick={() => history.push(RT_PROFILE)}>
                  <ListItemText primary={t("security.profile")}/>
                </ListItem>
                {user.role.includes(ROLE_PLAYER) &&
                <ListItem button onClick={() => history.push(RT_PLAYER_SHOW.replace(":id", user.player.id))}>
                  <ListItemText primary={t("player.show")}/>
                </ListItem>
                }
                {user.role.includes(ROLE_AGENT) &&
                <ListItem button onClick={() => history.push(RT_AGENT_SHOW.replace(":id", user.agent.id))}>
                  <ListItemText primary={t("player.show")}/>
                </ListItem>
                }
              </>
              :
              <>
                <ListItem button onClick={() => history.push(RT_LOGIN)}>
                  <ListItemText primary={t("security.signin")}/>
                </ListItem>
                <ListItem button onClick={() => history.push(RT_SIGNUP)}>
                  <ListItemText primary={t("security.signup")}/>
                </ListItem>
              </>
            }
          </List>
        </div>
        <div className={classes.grow}/>
        <div className={clsx(globalClasses.textCenter, globalClasses.mb2)}>
          {user &&
          <Button
            onClick={() => onLogout()}
            variant="contained"
            color="primary">
            {t("security.signout")}
          </Button>}
        </div>
      </SwipeableDrawer>
    </>
  );
};

export default Navigation;
