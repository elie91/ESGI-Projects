import React, { useState } from "react";
import { Card, CardContent, CardMedia, IconButton, makeStyles, Typography } from "@material-ui/core";
import CustomAvatar from "../Custom/CustomAvatar";
import { Skeleton } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import {Edit, Settings} from "@material-ui/icons";
import ModalImage from "./ModalImage";
import ModalEdit from "./ModalEdit";
import ModalBanner from "../Player/ModalBanner";
import Banner from "../../assets/images/banner.png";
import {RT_PROFILE} from "../../config/routes";
import {useHistory} from "react-router-dom";

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
}));

const Header = ({ agent, setAgent, isOwner }) => {

  const classes = useStyles();
  const [openDialogBanner, setOpenDialogBanner] = useState(false);
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <Card elevation={0}>
        {agent ?
          <CardMedia
            className={classes.media}
            image={agent.banner ? agent.banner : Banner}
            title="Banniere"
          />
          : <Skeleton variant="rect" width="100%" height={220}/>
        }
        <CardContent className={classes.containerContent}>
          <div className={classes.containerAvatar}>
            {agent &&
            <CustomAvatar
              onClick={() => setOpenDialogImage(true)}
              fontSize={46}
              className={classes.avatar}
              user={agent.user}
            />}
          </div>
          {isOwner() &&
          <div className={classes.editContainer}>
            <IconButton color="primary" onClick={() => setOpenDialogEdit(true)}>
              <Edit/>
            </IconButton>
            <IconButton color="primary" onClick={() => history.push(RT_PROFILE)}>
              <Settings/>
            </IconButton>
          </div>
          }
          <Typography variant="h5" component="h2" gutterBottom>
            {agent ? (agent.user.lastname + " " + agent.user.firstname) :
              <Skeleton/>}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {agent ? (agent.club.name ? agent.club.name : t("agent.club.empty")) :
              <Skeleton/>} </Typography>
        </CardContent>
      </Card>
      {isOwner() &&
      <>
        <ModalBanner
          setOpen={setOpenDialogBanner}
          open={openDialogBanner}
          player={agent}
          setPlayer={setAgent}
        />
        <ModalImage
          setOpen={setOpenDialogImage}
          open={openDialogImage}
          agent={agent}
          setAgent={setAgent}
        />
        <ModalEdit
          setOpen={setOpenDialogEdit}
          open={openDialogEdit}
          agent={agent}
          setAgent={setAgent}
        />
      </>
      }

    </>
  );
};

export default Header;
