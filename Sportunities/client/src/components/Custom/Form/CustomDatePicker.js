import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import { FormHelperText } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main,
  },
}));

const CustomDatePicker = ({
  name,
  label,
  control,
  defaultValue = new Date(),
  format = "dd/MM/yyyy",
  views = ["year", "month", "date"],
  minDate,
  maxDate,
  errors,
  ...rest
}) => {

  const { t } = useTranslation();
  const classes = useStyle();


  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={props =>
        <>
          <KeyboardDatePicker
            {...rest}
            views={views}
            required
            autoOk
            fullWidth
            minDate={minDate}
            maxDate={maxDate}
            invalidDateMessage={t("errors.date.invalid")}
            invalidLabel={t("errors.date.invalid")}
            minDateMessage={t("errors.date.min")}
            maxDateMessage={t("errors.date.max")}
            variant="inline"
            inputVariant="outlined"
            label={t(label)}
            format={format}
            value={props.value}
            InputAdornmentProps={{ position: "start" }}
            onChange={date => props.onChange(date)}
          />
          {errors && errors[name] &&
          <FormHelperText className={classes.error}>{t(errors[name] && t(errors[name].message))}</FormHelperText>}
        </>

      }
    />
  );
};

export default CustomDatePicker;
