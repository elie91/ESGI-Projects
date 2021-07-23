import React from "react";
import { Box, IconButton, Typography } from "@material-ui/core";
import { useGlobalStyles } from "../../../config/theme";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { Share, Close, ArrowUpward, ArrowDownward, Visibility, Comment, Favorite } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  actionButton: {
    padding: theme.spacing(1),
    backgroundColor: "rgba(28, 29, 36, 0.04)",
  },
  text: {
    marginLeft: theme.spacing(.5),
    marginRight: theme.spacing(.5),
  },
  inline: {
    marginRight: theme.spacing(1),
  },
  active: {
    color: "rgb(254, 44, 85)",
  },
  icon: {
    padding: theme.spacing(1),
    backgroundColor: "rgba(28, 29, 36, 0.04)",
    display: "inline-flex",
    flex: "0 0 auto",
    overflow: "visible",
    fontSize: "1.5rem",
    textAlign: "center",
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    borderRadius: "50%",
  },
}));

const CustomIconButton = ({
  icon,
  ariaLabel,
  size = "medium",
  fontSize = "small",
  isActive = false,
  text = null,
  flexDirection = "column",
  className,
  inline = false,
  spacingBottom = true,
  clickable = true,
  ...rest
}) => {

  const globalStyles = useGlobalStyles();
  const styles = useStyles();

  const Icon = () => {
    switch (icon) {
      case "like":
        return <Favorite color="inherit" fontSize={fontSize}/>;
      case "comment":
        return <Comment color="inherit" fontSize={fontSize}/>;
      case "view":
        return <Visibility color="inherit" fontSize={fontSize}/>;
      case "share":
        return <Share color="inherit" fontSize={fontSize}/>;
      case "close":
        return <Close color="inherit" style={{ color: "white" }} fontSize={fontSize}/>;
      case "previous":
        return <ArrowUpward color="inherit" fontSize={fontSize}/>;
      case "next":
        return <ArrowDownward color="inherit" fontSize={fontSize}/>;
      default:
        return <></>
    }
  };

  return (
    <div
      className={clsx(globalStyles.alignItemsCenter, spacingBottom ? globalStyles.mb1 : null, inline ? styles.inline : null, className)}>
      {clickable ?
        <IconButton
          color="inherit"
          aria-label={ariaLabel}
          className={clsx(styles.actionButton, isActive ? styles.active : null)} size={size} {...rest}>
          {Icon()}
        </IconButton>
        : <Box className={styles.icon}>{Icon()}</Box>
      }
      {text !== null && <Typography className={styles.text} variant="body2" component="span">{text}</Typography>}
    </div>
  );
};

export default CustomIconButton;
