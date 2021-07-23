import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, Grid, makeStyles, Typography } from "@material-ui/core";
import VideoUpload from "../../Custom/Form/VideoUpload";
import CustomSelect from "../../Custom/Form/CustomSelect";
import CustomCreatableSelect from "../../Custom/Form/CustomCreatableSelect";
import { useGlobalStyles } from "../../../config/theme";
import useSport from "../../../hooks/useSport";
import useTags from "../../../hooks/useTags";
import CustomTextField from "../../Custom/Form/CustomTextField";
import { API_VIDEOS } from "../../../config/entrypoint";
import LoadingButton from "../../Custom/Button/LoadingButton";
import { formatErrors } from "../../../helpers/Utils";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  videoPreview: {
    backgroundColor: theme.palette.greyLight.main,
    width: "100%",
    borderRadius: 5,
  },
  section: {
    fontWeight: 100,
    marginBottom: theme.spacing(2),
  },
}));

const VideoForm = ({
  onSubmit,
  handleSubmit,
  video,
  setVideo,
  data,
  loading,
  errors,
  register,
  edit = false,
  label,
  control,
}) => {

  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const classes = useStyles();
  const { selectors: sportSelectors, actions: actionsSport } = useSport();
  const { selectors: tagsSelectors, actions: tagsActions } = useTags();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    actionsSport.getSports()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
    tagsActions.getTags()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, []);

  if (!video && !edit) {
    return (
      <VideoUpload setVideo={setVideo} id="video-input"/>
    );
  } else {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card elevation={0} style={{ overflow: "initial" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <Typography variant="h6" gutterBottom>
                  {t("video.detail")}
                </Typography>

                <CustomTextField
                  className={globalStyles.mb2}
                  errors={errors}
                  register={register}
                  fullWidth
                  required
                  name="title"
                  data={data}
                  labelForm={label}
                />
                <CustomTextField
                  className={globalStyles.mb2}
                  multiline
                  rows={6}
                  errors={errors}
                  register={register}
                  fullWidth
                  required
                  name="description"
                  data={data}
                  labelForm={label}
                />

                <Typography variant="h6" gutterBottom>
                  {t("video.sport")}
                </Typography>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  className={classes.section}>
                  {t("video.sportDescription")}
                </Typography>
                <CustomSelect
                  containerClassName={globalStyles.mb2}
                  name="sport"
                  label="video.sport"
                  error={errors.sport}
                  control={control}
                  options={sportSelectors.getSports().map(sport => {
                    return { label: sport.name, value: sport.id };
                  })}
                  defaultValue={edit ? data.sport_id : ""}
                />

                <Typography variant="h6" gutterBottom>
                  {t("video.tags")}
                </Typography>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  className={classes.section}>
                  {t("video.tagsDescription")}
                </Typography>
                <CustomCreatableSelect
                  label="video.tags"
                  control={control}
                  defaultValue={edit ? data.tags.map(tag => {
                    return { label: tag.name, value: tag.id };
                  }) : ""}
                  name="tags"
                  options={tagsSelectors.getTags().map(tag => {
                    return { label: tag.name, value: tag.id };
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <LoadingButton className={globalStyles.mb2} fullWidth loading={loading} type="submit"
                               variant="contained" color="primary">
                  {edit ? t("video.update") : t("video.upload")}
                </LoadingButton>
                <video playsInline controls id="video-tag" className={classes.videoPreview}>
                  <source
                    id="video-source"
                    src={edit ? `${API_VIDEOS}/${data.id}/play` : URL.createObjectURL(video)}/>
                  {t("video.unsupported")}
                </video>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    );
  }
};

export default VideoForm;
