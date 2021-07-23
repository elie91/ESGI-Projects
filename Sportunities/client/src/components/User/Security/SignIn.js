import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  RT_ADMIN, RT_AGENT,
  RT_RESET_PASSWORD,
  RT_ROOT,
  RT_SIGNUP,
} from "../../../config/routes";
import { useAuth } from "../../../context/AuthContext";
import LoadingButton from "../../Custom/Button/LoadingButton";
import { ROLE_ADMIN, ROLE_AGENT } from "../../../config/constant";
import { Card, CardContent, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";
import PasswordField from "../../Custom/Form/PasswordField";
import { useGlobalStyles } from "../../../config/theme";
import CapitalizeButton from "../../Custom/Button/CapitalizeButton";
import FrontPage from "../../Custom/FrontPage";
import CustomTextField from "../../Custom/Form/CustomTextField";

const SignIn = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const classes = useGlobalStyles();
  const [loading, setLoading] = useState(false);
  const { actions } = useAuth();
  const history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = data => {
    setLoading(true);
    actions.signIn(data.email.toLowerCase(), data.password)
      .then((_user) => {
        enqueueSnackbar(t("security.success.signin"), { variant: "info" });
        if (_user && !_user.role.includes(ROLE_ADMIN) && !_user.role.includes(ROLE_AGENT)) {
          history.goBack();
        }
      })
      .catch((e) => {
        enqueueSnackbar(t(e.errors[0].message), { variant: "error" });
        setLoading(false);
      });
  };

  return (user ? (user.role.includes(ROLE_ADMIN) ? <Redirect to={RT_ADMIN}/> :
      (user.role.includes(ROLE_AGENT) ? <Redirect to={RT_AGENT}/> :
        <Redirect to={RT_ROOT}/>)) :
      <FrontPage title="security.signin">
        <Card elevation={0}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomTextField
                    errors={errors}
                    register={register}
                    fullWidth
                    required
                    type="email"
                    autoComplete="email"
                    name="email"
                    labelForm={"user"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordField
                    field="password"
                    label="user.password"
                    register={register}
                    errors={errors}
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
                {t("security.signin")}
              </LoadingButton>
            </form>
          </CardContent>
        </Card>
        <Grid container justify="space-between" spacing={2}>
          <Grid item xs={12} sm={6}>
            <CapitalizeButton variant="text" size="small" color="default"
                              onClick={() => history.push(RT_RESET_PASSWORD)}>
              {t("security.forgotPassword")}
            </CapitalizeButton>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.textRight}>
            <CapitalizeButton
              size="small"
              variant="text"
              color="default"
              onClick={() => history.push(RT_SIGNUP)}>
              {t("security.needAccount")}
            </CapitalizeButton>
          </Grid>
        </Grid>
      </FrontPage>
  );
};

export default SignIn;
