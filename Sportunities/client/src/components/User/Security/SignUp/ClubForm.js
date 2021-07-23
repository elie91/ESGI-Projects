import React from "react";
import { Grid, Typography } from "@material-ui/core";
import CustomTextField from "../../../Custom/Form/CustomTextField";
import { useTranslation } from "react-i18next";
import { COUNTRIES } from "../../../../config/constant";
import CustomSearchSelect from "../../../Custom/Form/CustomSearchSelect";

const ClubForm = ({ errors, register, control }) => {

  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle1">{t("club.add")}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          errors={errors}
          register={register}
          fullWidth
          required
          name="name"
          labelForm="club"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          errors={errors}
          register={register}
          fullWidth
          required
          name="city"
          labelForm="club"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <CustomTextField
          errors={errors}
          register={register}
          fullWidth
          required
          name="postalCode"
          labelForm="club"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomSearchSelect
          defaultValue={""}
          name="country"
          errors={errors}
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
    </>
  );
};

export default ClubForm;
