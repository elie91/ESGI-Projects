import React, { useState } from "react";
import CustomDialog from "../Custom/CustomDialog";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUpdateUser } from "../../config/schema";
import FileUpload from "../Custom/Form/FileUpload";
import { formatErrors, toBase64 } from "../../helpers/Utils";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/AuthContext";

const ModalImage = ({ open, setOpen, agent, setAgent }) => {

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm({
    resolver: yupResolver(schemaUpdateUser),
  });
  const { enqueueSnackbar } = useSnackbar();
  const { actions } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);

    let formatData = {
      ...data,
    };

    if (data.image && data.image.length > 0) {
      formatData = {
        ...formatData,
        image: await toBase64(data.image[0]),
      };
    } else {
      delete formatData.banner;
    }

    actions.update({
      ...formatData,
      id: agent.user.id,
    }).then((result) => {
      enqueueSnackbar(t("agent.dialog.image.success"), { variant: "success" });
      setAgent(prev => {
        return {
          ...prev,
          user: {
            ...result,
          },
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
      title="agent.dialog.image.title"
      textSubmitButton="agent.dialog.image.submitButton"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
    >
     <FileUpload
        defaultValue={(agent && agent.image) ? agent.image : null}
        register={register}
        setValue={setValue}
        name="image"
        label="user.image"
        error={errors.image}
      />
    </CustomDialog>
  );
};

export default ModalImage;
