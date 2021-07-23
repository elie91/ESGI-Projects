import React from "react";
import Grid from "@material-ui/core/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { schemaUpdatePassword } from "../../../config/schema";
import { useAuth } from "../../../context/AuthContext";
import { formatErrors } from "../../../helpers/Utils";
import CustomDialog from "../../Custom/CustomDialog";
import PasswordField from "../../Custom/Form/PasswordField";
import { useSnackbar } from "notistack";

const ModalPassword = ({ setOpen, open }) => {
  const { actions } = useAuth();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schemaUpdatePassword),
  });
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (data) => {
    actions.update(data)
      .then(() => setOpen(false))
      .catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
      });
  };

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      id="reset-password"
      onSubmit={onSubmit}
      maxWidth="md"
      handleSubmit={handleSubmit}
      title="security.updatePassword"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PasswordField
            register={register}
            label="user.currentPassword"
            field="currentPassword"
            errors={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PasswordField
            register={register}
            label="user.password"
            field="plainPassword"
            errors={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PasswordField
            register={register}
            label="user.confirmPassword"
            field="confirmPassword"
            errors={errors}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  );
};

export default ModalPassword;
