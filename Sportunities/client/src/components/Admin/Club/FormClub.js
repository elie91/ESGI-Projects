import React from "react";
import SpinLoader from "../../Custom/SpinLoader";
import { Grid, Card, CardContent } from "@material-ui/core";
import LoadingButton from "../../Custom/Button/LoadingButton";
import { useTranslation } from "react-i18next";
import FileUpload from "../../Custom/Form/FileUpload";
import CustomTextField from "../../Custom/Form/CustomTextField";
import { COUNTRIES } from "../../../config/constant";
import CustomSearchSelect from "../../Custom/Form/CustomSearchSelect";

const FormClub = ({
  onSubmit,
  handleSubmit,
  data,
  loading,
  errors,
  register,
  edit = false,
  label,
  image,
  setValue,
  control,
}) => {

  const { t } = useTranslation();

  return (
    <Card elevation={0} style={{ overflow: "initial" }}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {edit && !data && <SpinLoader/>}
          {((edit && data) || !edit) &&
          <Grid container spacing={2}>
            <Grid item sm={3} xs={12}/>
            <Grid item sm={6} xs={12}>
              <FileUpload
                defaultValue={image ? image : null}
                register={register}
                setValue={setValue}
                name="logo"
                label={label + ".logo"}
                error={errors.logo}
              />
            </Grid>
            <Grid item sm={3} xs={12}/>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                name="name"
                data={data}
                labelForm={label}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                name="city"
                data={data}
                labelForm={label}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                name="postalCode"
                data={data}
                labelForm={label}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSearchSelect
                errors={errors}
                defaultValue={data ? data.country : ""}
                name="country"
                control={control}
                options={COUNTRIES.map(item => {
                  return {
                    value: item.code,
                    label: item.name,
                  };
                })}
                placeholder="club.country"
                label="club.country"
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

export default FormClub;
