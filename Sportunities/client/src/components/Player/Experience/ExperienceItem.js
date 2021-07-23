import React from "react";
import { Avatar, makeStyles, Typography, Grid, IconButton, Tooltip } from "@material-ui/core";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDifferenceBetweenDate, formatErrors } from "../../../helpers/Utils";
import { CheckCircle, Delete, Edit, Image } from "@material-ui/icons";
import { useGlobalStyles } from "../../../config/theme";
import { useTranslation } from "react-i18next";
import useExperience from "../../../hooks/useExperience";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 65,
    width: 65,
    marginRight: theme.spacing(1),
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
  approved: {
    marginLeft: theme.spacing(1),
    color: theme.palette.success.main,
  },
}));

const ExperienceItem = ({ experience, setEdit, setPlayer, setOpenModal, isOwner }) => {

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
      club: experience.club.id,
      position: experience.position.id,
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
    <Grid className={globalClasses.mb2} alignItems="center" container spacing={2}>
      <Grid item xs={isOwner() ? 10 : 12}>
        <div className={globalClasses.alignItemsCenter}>
          {experience.club.logo ?
            <Avatar className={classes.avatar} src={experience.club.logo}/>
            : <Avatar className={classes.avatar}>
              <Image fontSize="large"/>
            </Avatar>}
          <div>
            <Typography className={classes.title} variant="subtitle1" component="h3">{experience.title}</Typography>
            <div className={globalClasses.alignItemsCenter}>
              <Typography variant="subtitle1"
                          component="h3">{experience.position.value} • {experience.club.name}</Typography>
              {experience.club.approved &&
              <Tooltip title={t("club.tooltip")} aria-label={t("club.tooltip")}>
                  <CheckCircle fontSize="small" className={classes.approved}/>
              </Tooltip>

              }
            </div>
            <Typography
              variant="body1"
              color="textSecondary"
              component="h3">
              {format(start, "MMM yyyy", { locale: fr })} - {end ?
              format(end, "MMM yyyy", { locale: fr })
              : t("experience.date.today")} • {formatDifferenceBetweenDate(end ? end : new Date(), start)}
            </Typography>
          </div>
        </div>


      </Grid>
      {isOwner() &&
      <Grid className={classes.editButton} item xs={2}>
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

export default ExperienceItem;
