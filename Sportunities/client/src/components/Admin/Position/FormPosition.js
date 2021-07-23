import React from "react";
import SpinLoader from "../../Custom/SpinLoader";
import { Grid, Card, CardContent } from "@material-ui/core";
import LoadingButton from "../../Custom/Button/LoadingButton";
import { useTranslation } from "react-i18next";
import CustomTextField from "../../Custom/Form/CustomTextField";

const FormPosition = ({
  onSubmit,
  handleSubmit,
  data,
  loading,
  errors,
  register,
  edit = false,
  label,
}) => {

  const { t } = useTranslation();

  return (
    <Card elevation={0}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {edit && !data && <SpinLoader/>}
          {((edit && data) || !edit) &&
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                name="value"
                data={data}
                labelForm={label}
              />
            </Grid>
          </Grid>
          }
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {t(edit ? (label + ".update") : (label + ".add"))}
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormPosition;
