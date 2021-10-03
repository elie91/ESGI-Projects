import React from "react";
import SpinLoader from "../../Custom/SpinLoader";
import { Grid, Card, CardContent, InputAdornment } from "@material-ui/core";
import LoadingButton from "../../Custom/Button/LoadingButton";
import { useTranslation } from "react-i18next";
import PasswordField from "../../Custom/Form/PasswordField";
import CustomSelect from "../../Custom/Form/CustomSelect";
import { GENDERS, ROLES_SELECT } from "../../../config/constant";
import CustomTextField from "../../Custom/Form/CustomTextField";
import CustomDatePicker from "../../Custom/Form/CustomDatePicker";
import { format as formatDate, subYears } from "date-fns";
import { MAX_BIRTHDAY, MIN_BIRTHDAY } from "../../../config/schema";
import FileUpload from "../../Custom/Form/FileUpload";

const FormUser = ({
  onSubmit,
  handleSubmit,
  data,
  loading,
  errors,
  register,
  edit = false,
  label,
  setValue,
  control
}) => {

  const { t } = useTranslation();

  return (
    <Card elevation={0}>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {edit && !data && <SpinLoader/>}
          {((edit && data) || !edit) &&
          <Grid container spacing={2}>
            <Grid item sm={3} xs={12}/>
            <Grid item sm={6} xs={12}>
              <FileUpload
                register={register}
                setValue={setValue}
                name="image"
                label="user.image"
                error={errors.image}
              />
            </Grid>
            <Grid item sm={3} xs={12}/>
            <Grid item xs={12}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                name="email"
                type="email"
                data={data}
                labelForm={label}
              />
            </Grid>
            {!edit &&
              <>
                <Grid item xs={12} sm={6}>
                  <PasswordField
                    label="user.password"
                    register={register}
                    field="password"
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PasswordField
                    label="user.confirmPassword"
                    register={register}
                    field="confirmPassword"
                    errors={errors}
                  />
                </Grid>
              </>
            }
            <Grid item xs={12} sm={4}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                autoComplete="family-name"
                name="lastname"
                labelForm={label}
                data={data}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                autoComplete="given-name"
                name="firstname"
                labelForm={label}
                data={data}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomSelect
                errors={errors}
                defaultValue={data?.role || ""}
                name="role"
                label="user.role"
                control={control}
                options={ROLES_SELECT}
                translateLabel
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomSelect
                errors={errors}
                defaultValue={data?.gender || ""}
                name="gender"
                label="user.gender.label"
                control={control}
                options={GENDERS}
                translateLabel
              />

            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomDatePicker
                minDate={formatDate(MIN_BIRTHDAY, '"dd/MM/yyyy')}
                maxDate={formatDate(MAX_BIRTHDAY, '"dd/MM/yyyy')}
                name="birthday"
                defaultValue={subYears(new Date(), 10)}
                label="user.birthday"
                control={control}
                autoComplete="bday"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                errors={errors}
                register={register}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">+33</InputAdornment>,
                }}
                data={data}
                autoComplete="phone"
                name="phone"
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

export default FormUser;
