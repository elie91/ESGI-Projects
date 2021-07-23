import React, { useState } from "react";
import CustomDialog from "../Custom/CustomDialog";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUpdateUser } from "../../config/schema";
import FileUpload from "../Custom/Form/FileUpload";
import { formatErrors, toBase64 } from "../../helpers/Utils";
import { useSnackbar } from "notistack";
import usePlayer from "../../hooks/usePlayer";

const ModalBanner = ({ open, setOpen, player, setPlayer }) => {

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm({
    resolver: yupResolver(schemaUpdateUser),
  });
  const { enqueueSnackbar } = useSnackbar();
  const { actions } = usePlayer();

  const onSubmit = async (data) => {
    setLoading(true);

    let formatData = {
      ...data,
    };

    if (data.banner && data.banner.length > 0) {
      formatData = {
        ...formatData,
        banner: await toBase64(data.banner[0]),
      };
    } else {
      delete formatData.banner;
    }

    actions.updatePlayer({
      ...formatData,
      id: player.id,
    }).then((result) => {
      enqueueSnackbar(t("player.dialog.banner.success"), { variant: "success" });
      setPlayer(prev => {
        return {
          ...prev,
          ...result,
        };
      });
      setLoading(false);
      setOpen(false);
    }).catch(e => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  return (
    <CustomDialog
      open={open}
      cancelButton={false}
      setOpen={setOpen}
      maxWidth="sm"
      title="player.dialog.banner.title"
      textSubmitButton="player.dialog.banner.submitButton"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
    >
      <FileUpload
        defaultValue={(player && player.banner) ? player.banner : null}
        aspectRatio={6 / 2}
        register={register}
        setValue={setValue}
        name="banner"
        label="player.banner"
        error={errors.banner}
      />
    </CustomDialog>
  );
};

export default ModalBanner;
