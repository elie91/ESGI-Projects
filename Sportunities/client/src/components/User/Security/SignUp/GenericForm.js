import React from "react";
import { Card, CardContent, Grid, InputAdornment } from "@material-ui/core";
import PasswordField from "../../../Custom/Form/PasswordField";
import CustomSelect from "../../../Custom/Form/CustomSelect";
import { GENDERS } from "../../../../config/constant";
import FileUpload from "../../../Custom/Form/FileUpload";
import CustomDatePicker from "../../../Custom/Form/CustomDatePicker";
import CustomTextField from "../../../Custom/Form/CustomTextField";
import { format as formatDate, subYears } from "date-fns";
import { MAX_BIRTHDAY, MIN_BIRTHDAY } from "../../../../config/schema";

const GenericForm = ({ errors, register, control, setValue }) => {

  return (
    <Card elevation={0}>
      <CardContent>
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
          <Grid item xs={12} sm={6}>
            <CustomTextField
              errors={errors}
              register={register}
              fullWidth
              required
              autoComplete="family-name"
              name="lastname"
              labelForm="user"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              errors={errors}
              register={register}
              fullWidth
              required
              autoComplete="given-name"
              name="firstname"
              labelForm="user"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              errors={errors}
              register={register}
              fullWidth
              required
              autoComplete="email"
              name="email"
              labelForm={"user"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <CustomSelect
              translateLabel
              defaultValue="MAN"
              name="gender"
              label="user.gender.label"
              control={control}
              options={GENDERS}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              errors={errors}
              register={register}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">+33</InputAdornment>,
              }}
              autoComplete="phone"
              name="phone"
              labelForm={"user"}
            />
          </Grid>
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GenericForm;
