import React, { useState } from "react";
import { Card, CardContent, IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useGlobalStyles } from "../../../config/theme";
import { Add } from "@material-ui/icons";
import ModalExperience from "./ModalExperience";
import { EXPERIENCE_TYPE_EXPERIENCE } from "../../../config/constant";
import clsx from "clsx";
import ExperienceItem from "./ExperienceItem";

const Experiences = ({ player, setPlayer, isOwner }) => {

  const { t } = useTranslation();
  const globalClasses = useGlobalStyles();
  const [openModal, setOpenModal] = useState(false);
  const [edit, setEdit] = useState(null);

  return (
    <>
      <Card elevation={0} className={globalClasses.mt2}>
        <CardContent>
          <div className={clsx(globalClasses.justifyBetween, globalClasses.mb2)}>
            <Typography variant="h5" component="h3">{t("experience.title")}</Typography>
            {isOwner() &&
            <IconButton color="primary" onClick={() => setOpenModal(true)}>
              <Add/>
            </IconButton>
            }
          </div>
          {player && player.experiences.filter(i => i.type === EXPERIENCE_TYPE_EXPERIENCE).map((experience, index) =>
            <ExperienceItem
              key={index}
              experience={experience}
              setPlayer={setPlayer}
              setEdit={setEdit}
              setOpenModal={setOpenModal}
              isOwner={isOwner}
            />,
          )}
          {player && player.experiences.filter(i => i.type === EXPERIENCE_TYPE_EXPERIENCE).length === 0 &&
          <Typography>{t('experience.empty')}</Typography>
          }
        </CardContent>
      </Card>
      {isOwner() &&
      <ModalExperience edit={edit} setEdit={setEdit} player={player} setPlayer={setPlayer} open={openModal} setOpen={setOpenModal}/>
      }
    </>

  );
};

export default Experiences;
