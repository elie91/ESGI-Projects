import React from "react";
import { Card, CardContent, makeStyles, Typography } from "@material-ui/core";
import { useGlobalStyles } from "../../../../config/theme";
import { formatHeight, formatUrlPlayer, ucFirst } from "../../../../helpers/Utils";
import { Skeleton } from "@material-ui/lab";
import { COUNTRIES } from "../../../../config/constant";
import CustomAvatar from "../../../Custom/CustomAvatar";
import { useTranslation } from "react-i18next";
import { RT_PLAYER_SHOW } from "../../../../config/routes";
import clsx from "clsx";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 100,
    width: 100,
    marginRight: theme.spacing(1),
  },
}));

const Header = ({ player }) => {

  const globalClasses = useGlobalStyles();
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const goToPlayer = () => {
    return history.push(formatUrlPlayer(player.user, player, RT_PLAYER_SHOW));
  };

  return (
    <Card elevation={0} style={{ height: "auto" }}>
      <CardContent>
        <div className={globalClasses.alignItemsCenter}>
          {player &&
          <CustomAvatar
            onClick={goToPlayer}
            fontSize={46}
            className={clsx(classes.avatar, globalClasses.cursorPointer)}
            user={player.user}
          />}
          <div>
            <Typography variant="h5" component="h2" gutterBottom onClick={goToPlayer}
                        className={globalClasses.cursorPointer}>
              {player ? (ucFirst(player.user.lastname) + " " + ucFirst(player.user.firstname)) :
                <Skeleton/>}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {player ? (player.sport ? player.sport.name : t("player.sport.empty")) :
                <Skeleton/>} </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {player ?
                (player.nationality && COUNTRIES.find(c => c.code === player.nationality).name) + " • " + player.weight + " kg • " + formatHeight(player.height)
                : <Skeleton/>
              }
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
