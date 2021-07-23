import React, { useState } from "react";
import { Card, CardContent, IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useGlobalStyles } from "../../../config/theme";
import { Add } from "@material-ui/icons";
import ModalTraining from "./ModalTraining";
import { EXPERIENCE_TYPE_TRAINING } from "../../../config/constant";
import clsx from "clsx";
import TrainingItem from "./TrainingItem";

const Training = ({ player, setPlayer, isOwner }) => {

  const { t } = useTranslation();
  const globalClasses = useGlobalStyles();
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(null);

  return (
    <>
      <Card elevation={0} className={globalClasses.mt2}>
        <CardContent>
          <div className={clsx(globalClasses.justifyBetween, globalClasses.mb2)}>
            <Typography variant="h5" component="h3">{t("training.title")}</Typography>
            {isOwner() &&
            <IconButton color="primary" onClick={() => setOpenModal(true)}>
              <Add/>
            </IconButton>
            }
          </div>
          {player && player.experiences.filter(i => i.type === EXPERIENCE_TYPE_TRAINING).map((experience, index, array) =>
            <TrainingItem
              key={index}
              experience={experience}
              setPlayer={setPlayer}
              setEdit={setEdit}
              setOpenModal={setOpenModal}
              isOwner={isOwner}
              isLast={array.length - 1 === index}
            />,
          )}
          {player && player.experiences.filter(i => i.type === EXPERIENCE_TYPE_TRAINING) &&
          <Typography>{t("experience.empty")}</Typography>
          }
        </CardContent>
      </Card>
      {isOwner() &&
      <ModalTraining edit={edit} setEdit={setEdit} player={player} setPlayer={setPlayer} open={openModal}
                     setOpen={setOpenModal}/>
      }
    </>

  );
};

export default Training;
