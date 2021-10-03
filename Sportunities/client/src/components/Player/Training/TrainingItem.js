import React from "react";
import { makeStyles, Typography, Grid, IconButton } from "@material-ui/core";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDifferenceBetweenDate, formatErrors } from "../../../helpers/Utils";
import { Delete, Edit } from "@material-ui/icons";
import { useGlobalStyles } from "../../../config/theme";
import { useTranslation } from "react-i18next";
import useExperience from "../../../hooks/useExperience";
import { useSnackbar } from "notistack";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: "auto",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    lineHeight: 1,
  },
  editButton: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  container: {
    borderBottom: "1px solid #eee",
  },
}));

const TrainingItem = ({ experience, setEdit, setPlayer, setOpenModal, isOwner, isLast }) => {

  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const start = new Date(experience.startDate);
  const end = experience.endDate ? new Date(experience.endDate) : null;
  const { t } = useTranslation();
  const { actions } = useExperience();
  const { enqueueSnackbar } = useSnackbar();

  const onEdit = () => {
    setEdit({
      ...experience,
      titleExperience: experience.title,
    });
    setOpenModal(true);
  };

  const onDelete = () => {
    actions.deleteExperience(experience.id)
      .then(() => {
        setPlayer(prev => {
          return {
            ...prev,
            experiences: prev.experiences.filter(e => e.id !== experience.id),
          };
        });
      })
      .catch(e => formatErrors(e, null, enqueueSnackbar))
    ;
  };

  return (
    <Grid
      className={clsx(globalClasses.mb2, clsx(!isLast ? classes.container : null))}
      alignItems="center"
      container
      spacing={2}>
      <Grid item xs={isOwner() ? 10 : 12} sm={isOwner() ? 10 : 11}>
        <Typography
          className={classes.title}
          variant="subtitle1"
          component="h3"
          gutterBottom>
          {experience.title}
        </Typography>
        <Typography variant="body2">{experience.description}</Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          component="h3">
          {format(start, "MMM yyyy", { locale: fr })} - {end ?
          format(end, "MMM yyyy", { locale: fr })
          : t("experience.date.today")} • {formatDifferenceBetweenDate(end ? end : new Date(), start)}
        </Typography>
      </Grid>
      {isOwner() &&
      <Grid className={classes.editButton} item sm={2} xs={2}>
        <div>
          <IconButton color="primary" onClick={onEdit}>
            <Edit/>
          </IconButton>
          <IconButton color="inherit" onClick={onDelete}>
            <Delete color="error"/>
          </IconButton>
        </div>
      </Grid>
      }

    </Grid>
  );
};

export default TrainingItem;
