import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import usePlayer from "../../hooks/usePlayer";
import { Container } from "@material-ui/core";
import Header from "./Header";
import Experiences from "./Experience";
import Trainings from "./Training";
import { useAuth } from "../../context/AuthContext";
import Videos from "./Video";
import { formatErrors } from "../../helpers/Utils";
import { useSnackbar } from "notistack";

const Profile = () => {

  const params = useParams();
  const { actions } = usePlayer();
  const [player, setPlayer] = useState(null);
  const location = useLocation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const isOwner = () => {
    return !!user && !!player && user.id === player.owner_id;
  };

  useEffect(() => {
    let isCancelled = false;
    if (params.id) {
      const exploded = params.id.split("-");
      actions.fetchPlayer(exploded[exploded.length - 1])
        .then(result => {
          if (!isCancelled) {
            setPlayer(result);
          }
        }).catch(e => formatErrors(e, null, enqueueSnackbar));
      return () => {
        isCancelled = true;
      };
    }

  }, [location.pathname]);


  return (
    <Container maxWidth="lg">
      <Header player={player} setPlayer={setPlayer} isOwner={isOwner}/>
      <Videos player={player} isOwner={() => isOwner()}/>
      <Experiences player={player} setPlayer={setPlayer} isOwner={() => isOwner()}/>
      <Trainings player={player} setPlayer={setPlayer} isOwner={() => isOwner()}/>
    </Container>
  );
};

export default Profile;
