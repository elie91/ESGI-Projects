import React, { useState } from "react";
import CustomDialog from "../../Custom/CustomDialog";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  schemaExperienceWithAddClub,
  schemaExperienceWithClub,
} from "../../../config/schema";
import { useSnackbar } from "notistack";
import FormExperience from "./FormExperience";
import useExperience from "../../../hooks/useExperience";
import { formatErrors, formatYupErrors } from "../../../helpers/Utils";
import { EXPERIENCE_TYPE_EXPERIENCE } from "../../../config/constant";

const ModalExperience = ({ open, setOpen, player, setPlayer, edit, setEdit }) => {

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError, control, watch } = useForm({
    resolver: async (data) => {
      try {
        let schema = null;
        if (data.addClub) {
          schema = schemaExperienceWithAddClub;
        } else {
          schema = schemaExperienceWithClub;
        }

        const values = await schema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: formatYupErrors(errors),
        };
      }
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const { actions } = useExperience();

  const onSubmit = async (data) => {
    setLoading(true);

    let formatData = {
      title: data.titleExperience,
      position: data.position,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      type: EXPERIENCE_TYPE_EXPERIENCE,
    };

    if (data.club) {
      formatData = {
        ...formatData,
        club_id: data.club,
      };
    } else {
      formatData = {
        ...formatData,
        club: {
          name: data.name,
          postalCode: data.postalCode,
          city: data.city,
          country: data.country,
        },
      };
    }

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
        enqueueSnackbar(t("experience.success.edit"), { variant: "success" });
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
        enqueueSnackbar(t("experience.success.add"), { variant: "success" });
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
      title={"experience." + (edit ? "edit" : "add")}
      textSubmitButton={"experience.dialog." + (edit ? "edit" : "add")}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
    >
      <FormExperience
        data={edit}
        register={register}
        control={control}
        errors={errors}
        label="experience"
        loading={loading}
        watch={watch}
      />
    </CustomDialog>
  );
};

export default ModalExperience;
