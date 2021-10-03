import React from "react";
import { Grid, TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import SpinLoader from "../../Custom/SpinLoader";
import CustomDatePicker from "../../Custom/Form/CustomDatePicker";
import CustomTextField from "../../Custom/Form/CustomTextField";
import CustomCheckbox from "../../Custom/Form/CustomCheckbox";
import {subMonths} from "date-fns";

const FormTraining = ({
  data,
  errors,
  register,
  edit = false,
  label,
  control,
  watch,
}) => {

  const { t } = useTranslation();
  const { actual } = watch();

  return (
    <>
      {edit && !data && <SpinLoader/>}
      {((edit && data) || !edit) &&
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <CustomTextField
            errors={errors}
            register={register}
            fullWidth
            required
            name="titleExperience"
            data={data}
            labelForm={label}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomCheckbox
            control={control}
            name="actual"
            label={label + ".already"}
            defaultValue={data && data.endDate === null}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            errors={errors}
            name="startDate"
            label={t(label + ".date.start")}
            control={control}
            format="MM/yyyy"
            views={["year", "month"]}
            required
            defaultValue={(data && data.startDate) ? new Date(data.startDate) : subMonths(new Date(), 1)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {actual ?
            <TextField fullWidth variant="outlined" disabled value={t("experience.date.today")}/>
            : <CustomDatePicker
              errors={errors}
              name="endDate"
              label={t(label + ".date.end")}
              control={control}
              format="MM/yyyy"
              views={["year", "month"]}
              required
              defaultValue={(data && data.endDate) ? new Date(data.endDate) : new Date()}
            />}
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomTextField
            errors={errors}
            register={register}
            fullWidth
            name="description"
            data={data}
            labelForm={label}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      }
    </>
  );

};
;

export default FormTraining;
