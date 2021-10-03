import React from "react";
import { ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import CustomAvatar from "../../Custom/CustomAvatar";
import { formatUrlPlayer, ucFirst } from "../../../helpers/Utils";
import { Favorite, Visibility } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { RT_PLAYER_SHOW } from "../../../config/routes";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  subtitle: {
    display: "flex",
    alignItems: "center",
  },
  text: {
    marginLeft: theme.spacing(0.5),
  },
  icon: {
    fontSize: "1.25rem",
  },
  red: {
    color: theme.palette.error.main
  },
  content: {
    marginLeft: theme.spacing(2),
  },
}));

const Item = ({ player }) => {

  const classes = useStyles();
  const history = useHistory();

  const gotToPlayer = () => {
    history.push(formatUrlPlayer(player.user, player, RT_PLAYER_SHOW));
  };

  return (
    <ListItem button alignItems="flex-start" onClick={gotToPlayer}>
      <ListItemAvatar>
        <CustomAvatar user={player.user}/>
      </ListItemAvatar>
      <ListItemText
        primary={ucFirst(player.user.lastname) + " " + ucFirst(player.user.firstname)}
        secondary={
          <Typography className={classes.subtitle}>
            <Typography
              className={classes.subtitle}
              component="span"
              variant="body2"
            >
              <Favorite className={clsx(classes.icon, classes.red)}/>
              <Typography
                className={classes.text}
                component="span"
                variant="body2"
              >
                {player.likes}
              </Typography>
            </Typography>
            <Typography
              className={clsx(classes.subtitle, classes.content)}
              component="span"
              variant="body2"
            >
              <Visibility color="inherit" className={classes.icon}/>

              <Typography
                className={classes.text}
                component="span"
                variant="body2"
              >
                {player.views}
              </Typography>
            </Typography>
          </Typography>
        }
      />
    </ListItem>
  );
};

export default Item;
