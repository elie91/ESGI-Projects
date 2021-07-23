import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaSignUpPlayerWithClub } from "../../config/schema";
import { useSnackbar } from "notistack";
import usePlayer from "../../hooks/usePlayer";
import { formatErrors } from "../../helpers/Utils";
import CustomDialog from "../Custom/CustomDialog";
import PlayerForm from "../User/Security/SignUp/PlayerForm";
import usePosition from "../../hooks/usePosition";

const ModalEdit = ({ open, setOpen, player, setPlayer }) => {

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError, control, watch } = useForm({
    resolver: yupResolver(schemaSignUpPlayerWithClub),
  });

  const { enqueueSnackbar } = useSnackbar();
  const { actions } = usePlayer();
  const { actions: actionsPosition } = usePosition();

  useEffect(() => {
    if (player && player.sport_id){
      actionsPosition.getPositions({
        sport_id: player.sport_id,
      }).catch(e => formatErrors(e, null, enqueueSnackbar));
    }
  }, [player]);


  const onSubmit = async (data) => {

    setLoading(true);

    actions.updatePlayer({
      ...data,
      id: player.id,
    }).then((result) => {
      enqueueSnackbar(t("player.dialog.edit.success"), { variant: "success" });
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
      maxWidth="md"
      title="player.dialog.edit.title"
      textSubmitButton="player.dialog.edit.submitButton"
      onSubmit={onSubmit}
      handleSubmit={handleSubmit}
      loading={loading}
    >
      <PlayerForm
        values={player}
        errors={errors}
        register={register}
        control={control}
        watch={watch}
      />

    </CustomDialog>
  );
};

export default ModalEdit;
