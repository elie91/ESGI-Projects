import React, { useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Button,
  ListItem,
  makeStyles,
  Collapse,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import useNavigation from "../../hooks/useNavigation";
import { RT_AGENT_CONVERSATIONS, RT_CONVERSATIONS } from "../../config/routes";
import { useAuth } from "../../context/AuthContext";
import { ROLE_AGENT } from "../../config/constant";

const useStyles = makeStyles((theme) => ({
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: theme.spacing(1),
  },
  subItem: {
    paddingLeft: "48px!important",
  },
  my: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: "flex-start",
    letterSpacing: 0,
    padding: theme.spacing(1),
    textTransform: "none",
    width: "100%",
    "&:hover,&:focus": {
      backgroundColor: theme.palette.primary.main + "24",
      color: theme.palette.primary.main,
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: "auto",
  },
  active: {
    backgroundColor: theme.palette.primary.main + "24",
    color: theme.palette.primary.main,
    "& $title": {
      fontWeight: theme.typography.fontWeightMedium,
    },
    "& $icon": {
      color: theme.palette.primary.main,
    },
  },
  accordion: {
    "&:before": {
      height: 0,
    },
  },
  margin: {
    margin: 0,
  },
}));

const SidebarItem = ({
  restaurant,
  className,
  item,
  icon: Icon,
  ...rest
}) => {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { actions } = useNavigation();
  const { user } = useAuth();

  const checkActive = (match, location) => {
    //some additional logic to verify you are in the home URI
    if (!location) return false;
    const { pathname } = location;
    return match && pathname === match.url;
  };

  const checkHref = (currentItem) => {
    if (user && currentItem.href === RT_CONVERSATIONS) {
      if (user.role.includes(ROLE_AGENT)){
        return RT_AGENT_CONVERSATIONS;
      }
    }
    return currentItem.href;
  };

  return (
    item.child ?
      <>
        <ListItem className={clsx(classes.item, className)} disableGutters {...rest}>
          <Button className={classes.button} onClick={() => setOpen(!open)}>
            {Icon && (
              <Icon className={classes.icon} size="20"/>
            )}
            <span className={classes.title}>
              {item.title}
            </span>
            {open ? <ExpandLess/> : <ExpandMore/>}
          </Button>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {item.child.map((subItem, index) => (
            <ListItem key={index} className={clsx(classes.item, classes.my, className)} disableGutters>
              <Button
                exact
                strict
                activeClassName={classes.active}
                className={clsx(classes.button, classes.subItem)}
                component={RouterLink}
                to={checkHref(subItem)}
                onClick={() => actions.toggleNavigation(false)}>
                {subItem.icon && (
                  <subItem.icon className={classes.icon} size="20"/>
                )}
                <span className={classes.title}>
                  {subItem.title}
                </span>
              </Button>
            </ListItem>
          ))}

        </Collapse>
      </>
      :
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        {...rest}
      >
        <Button
          activeClassName={classes.active}
          isActive={checkActive}

          className={classes.button}
          component={RouterLink}
          to={checkHref(item)}
        >
          {Icon && (
            <Icon
              className={classes.icon}
              size="20"
            />
          )}
          <span className={classes.title}>
          {item.title}
        </span>
        </Button>
      </ListItem>
  );
};

SidebarItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.elementType,
  item: PropTypes.object,
};

export default SidebarItem;
