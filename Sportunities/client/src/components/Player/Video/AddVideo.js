import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUploadVideo } from "../../../config/schema";
import usePlayerVideos from "../../../hooks/usePlayerVideos";
import { RT_PLAYER_VIDEOS } from "../../../config/routes";
import { useHistory } from "react-router-dom";
import AdminPage from "../../Custom/AdminPage";
import VideoForm from "./VideoForm";

const AddVideo = () => {
  const { actions: playerVideoActions } = usePlayerVideos();
  const history = useHistory();
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm({
    resolver: yupResolver(schemaUploadVideo),
  });
  const [video, setVideo] = useState(null);

  const onSubmit = async data => {
    if (data.tags.length > 0) {
      data = {
        ...data,
        tags: data.tags.map(tag => {
          if (tag.__isNew__ && !tag.label.startsWith("#")) {
            tag.label = `#${tag.label}`;
          }
          return tag;
        }),
      };
    }

    const formData = new FormData();
    formData.append("file", video);
    formData.append("videoInfos", JSON.stringify(data));
    await playerVideoActions.uploadVideoAction(formData);
    history.push(RT_PLAYER_VIDEOS);
  };

  return (
    <AdminPage title="video.add">
      <VideoForm
        label="video"
        register={register}
        setValue={setValue}
        video={video}
        setVideo={setVideo}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        control={control}
      />
    </AdminPage>
  );

};

export default AddVideo;
