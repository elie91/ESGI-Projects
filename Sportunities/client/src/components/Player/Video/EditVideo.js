import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUploadVideo } from "../../../config/schema";
import { useSnackbar } from "notistack";
import AdminPage from "../../Custom/AdminPage";
import VideoForm from "./VideoForm";
import usePlayerVideos from "../../../hooks/usePlayerVideos";
import SpinLoader from "../../Custom/SpinLoader";
import useTags from "../../../hooks/useTags";
import { formatErrors } from "../../../helpers/Utils";
import { RT_PLAYER_VIDEOS } from "../../../config/routes";
const EditVideo = () => {

  const { t } = useTranslation();
  const params = useParams();
  const { register, handleSubmit, formState: { errors }, control, setError, setValue } = useForm({
    resolver: yupResolver(schemaUploadVideo),
  });
  const { actions: tagsActions } = useTags();
  const { actions } = usePlayerVideos();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tagsActions.getTags()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, []);

  useEffect(() => {
    actions.fetchVideo(params.id)
        .then(data => setVideo(data))
        .then(() => setIsLoading(false))
        .catch(e => formatErrors(e, null, enqueueSnackbar))

  }, []);

  const onSubmit = async values => {
    if (values.tags.length > 0) {
      values = {
        ...values,
        tags: values.tags.map(tag => {
          if (tag.__isNew__ && !tag.label.startsWith("#")) {
            tag.label = `#${tag.label}`;
          }
          return tag;
        }),
      };
    }

    actions.updateVideo({ ...values, id: video.id })
      .then(() => {
        enqueueSnackbar(t("video.updateSuccess"), { variant: "info" });
        history.push(RT_PLAYER_VIDEOS);
      }).catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
      });
  }

  if (isLoading) {
    return <SpinLoader />
  }

  return (
    <AdminPage title="video.add">
      <VideoForm
        label="video"
        edit={true}
        data={video}
        loading={isLoading}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        control={control}
      />
    </AdminPage>
  )
}

export default EditVideo;
