import React from "react";
import { Card, CardActions, CardContent, IconButton, Tooltip, Typography } from "@material-ui/core";
import { Visibility, Chat } from "@material-ui/icons";
import clsx from "clsx";
import { useGlobalStyles } from "../../config/theme";
import { useTranslation } from "react-i18next";
import useConversation from "../../hooks/useConversation";
import { formatErrors, formatUrlPlayer } from "../../helpers/Utils";
import { useSnackbar } from "notistack";
import CustomAvatar from "./CustomAvatar";
import { useHistory } from "react-router-dom";
import { RT_AGENT_CONVERSATIONS, RT_PLAYER_SHOW } from "../../config/routes";

const CardPlayer = ({ player }) => {

  const classes = useGlobalStyles();
  const { t } = useTranslation();
  const { actions } = useConversation();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const startConversation = () => {
    actions.addConversation({
      receiver: player.user.id,
    }).then(() => {
      history.push(RT_AGENT_CONVERSATIONS);
    }).catch((err) => {
      formatErrors(err, null, enqueueSnackbar);
    });
  };

  const goToPlayer = () => {
    history.push(formatUrlPlayer(player.user, player, RT_PLAYER_SHOW));
  };

  return (
    <Card elevation={0}>
      <CardContent className={classes.cardCenter}>
        <CustomAvatar fontSize={30} className={clsx(classes.avatarLarge, classes.mb2)} user={player.user}/>
        <Typography variant="h6" gutterBottom>
          {player.user.lastname + " " + player.user.firstname}
        </Typography>
        {(player.position || player.club) &&
        <Typography variant="body1" gutterBottom>
          {(player.position ? (player.position.value + player.club ? " - " : null) : null) + player.club ? player.club.name : null}
        </Typography>
        }

      </CardContent>
      <CardActions className={classes.justifyCenter}>
        <Tooltip title={t("player.consult")}>
          <IconButton onClick={goToPlayer}>
            <Visibility/>
          </IconButton>
        </Tooltip>
        {!player.hasConversation &&
        <Tooltip title={t("conversation.start")}>
          <IconButton onClick={startConversation}>
            <Chat/>
          </IconButton>
        </Tooltip>
        }
      </CardActions>
    </Card>
  );
};

export default CardPlayer;
