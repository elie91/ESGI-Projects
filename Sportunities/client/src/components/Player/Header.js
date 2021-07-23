import React, { useState } from "react";
import { Button, Card, CardContent, CardMedia, IconButton, makeStyles, Typography } from "@material-ui/core";
import CustomAvatar from "../Custom/CustomAvatar";
import { Skeleton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import Banner from "../../assets/images/banner.png";
import { PhotoCamera, Edit, Settings } from "@material-ui/icons";
import ModalBanner from "./ModalBanner";
import ModalImage from "./ModalImage";
import { COUNTRIES, ROLE_AGENT } from "../../config/constant";
import { formatErrors, formatHeight, ucFirst } from "../../helpers/Utils";
import ModalEdit from "./ModalEdit";
import { RT_AGENT_CONVERSATIONS, RT_PROFILE } from "../../config/routes";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/AuthContext";
import useConversation from "../../hooks/useConversation";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 220,
  },
  avatar: {
    height: 160,
    width: 160,
    border: "3px solid #fff",
    cursor: "pointer",
  },
  containerAvatar: {
    marginTop: -100,
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  editBannerButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  editBannerButtonIcon: {
    color: "white",
  },
  editContainer: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  containerContent: {
    position: "relative",
  },
  containerButton: {
    display: "flex",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
}));

const Header = ({ player, setPlayer, isOwner }) => {

  const classes = useStyles();
  const [openDialogBanner, setOpenDialogBanner] = useState(false);
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const { actions } = useConversation();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const history = useHistory();
  const { user } = useAuth();

  const hasConversation = () => {
    return player && player.user.receivedConversation.some(i => i.receiver_id === player.user.id);
  };

  const startConversation = () => {
    actions.addConversation({
      receiver: player.user.id,
    }).then(() => {
      history.push(RT_AGENT_CONVERSATIONS);
    }).catch((err) => {
      formatErrors(err, null, enqueueSnackbar);
    });
  };

  return (
    <>
      <Card elevation={0}>
        {isOwner() &&
        <div className={classes.editBannerButton}>
          <IconButton className={classes.editBannerButtonIcon} onClick={() => setOpenDialogBanner(true)}>
            <PhotoCamera/>
          </IconButton>
        </div>
        }

        {player ?
          <CardMedia
            className={classes.media}
            image={player.banner ? player.banner : Banner}
            title="Banniere"
          />
          : <Skeleton variant="rect" width="100%" height={220}/>
        }
        <CardContent className={classes.containerContent}>
          <div className={classes.containerAvatar}>
            {player &&
            <CustomAvatar
              onClick={() => setOpenDialogImage(true)}
              fontSize={46}
              className={classes.avatar}
              user={player.user}
            />}
          </div>
          <div className={classes.editContainer}>
            {isOwner() ?
              <>
                <IconButton color="primary" onClick={() => setOpenDialogEdit(true)}>
                  <Edit/>
                </IconButton>
                <IconButton color="primary" onClick={() => history.push(RT_PROFILE)}>
                  <Settings/>
                </IconButton>
              </>
              :
              <div className={classes.containerButton}>
                {user && user.role.includes(ROLE_AGENT) && !hasConversation() &&
                <Button color="primary" variant="contained"
                        onClick={startConversation}>{t("conversation.start")}</Button>
                }
                <Button className={classes.marginLeft} color="primary"
                        variant="outlined">{t("subscriptions.subscribe")}</Button>
              </div>}
          </div>
          <Typography variant="h5" component="h2" gutterBottom>
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
        </CardContent>
      </Card>
      {isOwner() &&
      <>
        <ModalBanner
          setOpen={setOpenDialogBanner}
          open={openDialogBanner}
          player={player}
          setPlayer={setPlayer}
        />
        <ModalImage
          setOpen={setOpenDialogImage}
          open={openDialogImage}
          player={player}
          setPlayer={setPlayer}
        />
        <ModalEdit
          setOpen={setOpenDialogEdit}
          open={openDialogEdit}
          player={player}
          setPlayer={setPlayer}
        />
      </>
      }

    </>
  );
};

export default Header;
