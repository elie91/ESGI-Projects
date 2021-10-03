import React, { useState } from "react";
import CustomDialog from "../../Custom/CustomDialog";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import FormTraining from "./FormTraining";
import useExperience from "../../../hooks/useExperience";
import { formatErrors, } from "../../../helpers/Utils";
import { EXPERIENCE_TYPE_TRAINING } from "../../../config/constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaTraining } from "../../../config/schema";

const ModalTraining = ({ open, setOpen, player, setPlayer, edit, setEdit }) => {

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError, control, watch } = useForm({
    resolver: yupResolver(schemaTraining)
  });
  const { enqueueSnackbar } = useSnackbar();
  const { actions } = useExperience();

  const onSubmit = async (data) => {
    setLoading(true);

    let formatData = {
      title: data.titleExperience,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      type: EXPERIENCE_TYPE_TRAINING,
    };

    if (edit) {
      actions.updateExperience({
        ...formatData,
        id: edit.id,
      }).then((newExperience) => {
        setPlayer(prev => {
          return {
            ...prev,
            experiences: prev.experiences.map(e => {
              if (e.id === newExperience.id) {
                return {
                  ...e,
                  ...newExperience,
                };
              }
              return e;
            }),
          };
        });
        enqueueSnackbar(t("training.success.edit"), { variant: "success" });
        setLoading(false);
        setOpen(false);
        setEdit(null);
      }).catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
        setLoading(false);
      });
    } else {
      actions.addExperience({
        ...formatData,
        player_id: player.id,
      }).then((newExperience) => {
        setPlayer(prev => {
          return {
            ...prev,
            experiences: [
              ...prev.experiences,
              newExperience,
            ],
          };
        });
        enqueueSnackbar(t("training.success.add"), { variant: "success" });
        setLoading(false);
        setOpen(false);
      }).catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
        setLoading(false);
      });
    }
  };

  return (
    <CustomDialog
      open={open}
      cancelButton={false}
      setOpen={setOpen}
      maxWidth="sm"
      title={"training." + (edit ? "edit" : "add")}
      textSubmitButton={"training.dialog." + (edit ? "edit" : "add")}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
    >
      <FormTraining
        data={edit}
        register={register}
        control={control}
        errors={errors}
        label="training"
        loading={loading}
        watch={watch}
      />
    </CustomDialog>
  );
};

export default ModalTraining;
