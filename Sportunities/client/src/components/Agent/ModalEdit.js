import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {schemaUpdateUser} from "../../config/schema";
import {useSnackbar} from "notistack";
import useAgent from "../../hooks/useAgent";
import {formatErrors, toBase64} from "../../helpers/Utils";
import CustomDialog from "../Custom/CustomDialog";
import AgentForm from "../User/Security/SignUp/AgentForm";

const ModalEdit = ({open, setOpen, agent, setAgent}) => {

  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const {register, handleSubmit, formState: {errors}, setError, watch, setValue, control} = useForm({
    resolver: yupResolver(schemaUpdateUser),
  });
  const {enqueueSnackbar} = useSnackbar();
  const {actions} = useAgent();

  const onSubmit = async (data) => {
    setLoading(true);
    let formatData = {
      ...data,
    };

    if (data.idCardFront.length !== 0 && data.idCardBack.length !== 0) {
      formatData = {
        ...formatData,
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
        ]
      };
    }
    else if (data.idCardFront.length !== 0 ) {
      formatData = {
        ...formatData,
        documents: [
          {
            name: "idCardFront",
            type: data.idCardFront[0].type,
            base64: await toBase64(data.idCardFront[0]),
          },
        ]
      };
    } else if (data.idCardBack.length !== 0) {
      formatData = {
        ...formatData,
        documents: [
          {
            name: "idCardBack",
            type: data.idCardBack[0].type,
            base64: await toBase64(data.idCardBack[0]),
          },
        ]
      };
    }

    actions.updateAgent({
      ...formatData,
      id: agent.id,
    }).then((result) => {
      enqueueSnackbar(t("player.dialog.edit.success"), {variant: "success"});
      setAgent(prev => {
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
      title="player.dialog.edit.title"
      textSubmitButton="player.dialog.edit.submitButton"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
    >
      <AgentForm
        watch={watch}
        setValue={setValue}
        control={control}
        values={agent}
        errors={errors}
        register={register}
      />

    </CustomDialog>
  );
};

export default ModalEdit;
