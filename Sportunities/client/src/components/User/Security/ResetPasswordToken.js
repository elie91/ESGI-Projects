import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { RT_LOGIN, RT_ROOT } from "../../../config/routes";
import { useAuth } from "../../../context/AuthContext";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaConfirmResetPassword } from "../../../config/schema";
import LoadingButton from "../../Custom/Button/LoadingButton";
import {
  Card,
  Grid,
  CardContent, Button,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import PasswordField from "../../Custom/Form/PasswordField";
import FrontPage from "../../Custom/FrontPage";

const ResetPasswordToken = () => {
  const { token } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { actions } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schemaConfirmResetPassword),
  });
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onSubmit = data => {
    setLoading(true);
    actions.tokenResetPassword({
      ...data,
      token: token,
    }).then(() => {
      setLoading(false);
      enqueueSnackbar(t("mail.success.updatePassword"), { variant: "success" });
      history.push(RT_LOGIN);
    }).catch((e) => {
      enqueueSnackbar(t(e.message), { variant: "error" });
      setLoading(false);
    });
  };

  return (user ? <Redirect to={RT_ROOT}/> :
      <FrontPage title="security.resetPassword">
        <Card variant="outlined">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <PasswordField
                    field="plainPassword"
                    label="user.password"
                    errors={errors}
                    register={register}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordField
                    field="confirmPassword"
                    label="user.confirmPassword"
                    errors={errors}
                    register={register}
                  />
                </Grid>
              </Grid>
              <LoadingButton
                loading={loading}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {t("security.resetPassword")}
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
        <Grid container spacing={2} justify="center">
          <Grid item>
            <Button onClick={() => history.push(RT_LOGIN)} variant="text" color="default">
              {t("button.back")}
            </Button>
          </Grid>
        </Grid>
      </FrontPage>
  );
};

export default ResetPasswordToken;
