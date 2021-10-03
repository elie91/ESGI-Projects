import React, {useState} from "react";
import {useGlobalStyles} from "../../../../config/theme";
import {useForm} from "react-hook-form";
import {
  schemaSignUpAgentWithAddClub, schemaSignUpAgentWithClub,

} from "../../../../config/schema";
import {formatErrors, formatYupErrors, toBase64} from "../../../../helpers/Utils";
import {LS_JWT_TOKEN} from "../../../../config/constant";
import {RT_AGENT} from "../../../../config/routes";
import {useAuth} from "../../../../context/AuthContext";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import clsx from "clsx";
import {Button} from "@material-ui/core";
import LoadingButton from "../../../Custom/Button/LoadingButton";
import {useSnackbar} from "notistack";
import useAgent from "../../../../hooks/useAgent";
import AgentForm from "./AgentForm";

const Agent = ({setStep, setRole}) => {

  const globalClasses = useGlobalStyles();
  const {actions: actionsAgent} = useAgent();
  const {actions: actionsUser} = useAuth();
  const {t} = useTranslation();
  const {enqueueSnackbar} = useSnackbar();

  const {register, handleSubmit, formState: {errors}, control, setError, watch, setValue, values} = useForm({
    resolver: async (data) => {
      try {
        let schema = null;
        if (data.addClub) {
          schema = schemaSignUpAgentWithAddClub;
        } else {
          schema = schemaSignUpAgentWithClub;
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
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const goBack = () => {
    setStep(0);
    setRole(null);
  };

  const onSubmit = async (data) => {
    let findErrors = false;

    if (!data.idCardFront[0]) {
      setError("idCardFront", {type: "manual", message: t('errors.required')});
      findErrors = true;
    }

    if (!data.idCardBack[0]) {
      setError("idCardBack", {type: "manual", message: t('errors.required')});
      findErrors = true;
    }

    if (findErrors){
      return
    }

    setLoading(true);

    let formatData = {
      documents: [
        {
          name: "idCardFront",
          type: data.idCardFront[0].type,
          base64: await toBase64(data.idCardFront[0]),
        },
        {
          name: "idCardBack",
          type: data.idCardBack[0].type,
          base64: await toBase64(data.idCardBack[0]),
        },
      ],
    };

    if (data.club_id) {
      formatData = {
        ...formatData,
        club_id: data.club_id,
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
    actionsAgent.addAgent(formatData)
      .then((result) => {
        actionsUser.refreshUser(result.user)
          .then(() => {
            localStorage.setItem(LS_JWT_TOKEN, result.token);
            history.push(RT_AGENT);
            enqueueSnackbar(t("security.steps.success.agent"));
          });
      }).catch(e => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoading(false);
    });
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AgentForm
        values={values}
        setValue={setValue}
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

export default Agent;
