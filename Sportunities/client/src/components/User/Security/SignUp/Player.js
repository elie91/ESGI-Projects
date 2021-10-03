import React, { useState } from "react";
import PlayerForm from "./PlayerForm";
import { useGlobalStyles } from "../../../../config/theme";
import { useForm } from "react-hook-form";
import { schemaSignUpPlayerWithAddClub, schemaSignUpPlayerWithClub } from "../../../../config/schema";
import { formatErrors, formatYupErrors } from "../../../../helpers/Utils";
import { LS_JWT_TOKEN } from "../../../../config/constant";
import { RT_ROOT } from "../../../../config/routes";
import usePlayer from "../../../../hooks/usePlayer";
import { useAuth } from "../../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { Button } from "@material-ui/core";
import LoadingButton from "../../../Custom/Button/LoadingButton";
import { useSnackbar } from "notistack";

const Player = ({ setStep, setRole }) => {

  const globalClasses = useGlobalStyles();
  const { actions: actionsPlayer } = usePlayer();
  const { actions: actionsUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, formState: { errors }, control, setError, watch } = useForm({
    resolver: async (data) => {
      try {
        let schema = null;
        if (data.addClub) {
          schema = schemaSignUpPlayerWithAddClub;
        } else {
          schema = schemaSignUpPlayerWithClub;
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

  const goBack = () => {
    setStep(0);
    setRole(null);
  };

  const onSubmit = (data) => {
    setLoading(true);

    let formatData = {
      height: data.height,
      weight: data.weight,
      nationality: data.nationality,
      position_id: data.position_id,
      sport_id: data.sport_id,
    };

    if (data.club_id) {
      formatData = {
        ...formatData,
        club_id: data.club_id,
      };
    } else {
      if (data.name && data.postalCode && data.city && data.country) {
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
    }

    actionsPlayer.addPlayer(formatData)
      .then((result) => {
        actionsUser.refreshUser(result.user)
          .then(() => {
            localStorage.setItem(LS_JWT_TOKEN, result.token);
            history.push(RT_ROOT);
            enqueueSnackbar(t("security.steps.success.player"));
          });
      }).catch(e => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PlayerForm
        register={register}
        errors={errors}
        control={control}
        watch={watch}
      />
      <div className={clsx(globalClasses.justifyBetween)}>
        <Button className={globalClasses.mt2} type="button" variant="outlined" color="primary" onClick={goBack}>
          {t("button.back")}
        </Button>
        <LoadingButton type="submit" loading={loading} variant="contained" color="primary">
          {t("button.confirm")}
        </LoadingButton>
      </div>
    </form>
  );
};

export default Player;
