import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { RT_LOGIN, RT_ROOT } from "../../../config/routes";
import { useAuth } from "../../../context/AuthContext";
import { Redirect, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaResetPassword } from "../../../config/schema";
import LoadingButton from "../../Custom/Button/LoadingButton";
import { Card, CardContent, Grid, TextField, Button } from "@material-ui/core";
import { formatErrors } from "../../../helpers/Utils";
import { useSnackbar } from "notistack";
import FrontPage from "../../Custom/FrontPage";

const ResetPassword = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { actions } = useAuth();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schemaResetPassword),
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const onSubmit = data => {
    setLoading(true);
    actions.resetPassword(data)
      .then(() => {
        enqueueSnackbar(t("mail.success.sendPassword"), { variant: "success" });
      })
      .catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
        setLoading(false);
      });
  };

  return (user ? <Redirect to={RT_ROOT}/> :
      <FrontPage title="security.resetPassword">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={!!errors.email}
                    helperText={errors.email && t(errors.email.message)}
                    variant="outlined"
                    required
                    fullWidth
                    autoFocus
                    id="email"
                    label={t("user.email")}
                    name="email"
                    autoComplete="email"
                    inputRef={register}
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
        <Grid container justify="center" spacing={2}>
          <Grid item>
            <Button onClick={() => history.push(RT_LOGIN)} variant="text" color="default">
              {t("button.back")}
            </Button>
          </Grid>
        </Grid>
      </FrontPage>
  );
};

export default ResetPassword;
