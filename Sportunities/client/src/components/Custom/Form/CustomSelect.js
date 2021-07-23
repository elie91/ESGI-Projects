import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

/*
 options need an array [{label : 'Label', value: 'value'}, ...]
 */

const useStyle= makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main
  }
}));

const CustomSelect = ({
  name,
  label,
  control,
  options,
  defaultValue = "",
  translateLabel = false,
  containerClassName,
  disabled = false,
  errors
}) => {

  const { t } = useTranslation();
  const classes = useStyle()

  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      control={control}
      options={options}
      render={({ onChange, value }) => (
        <FormControl variant="outlined" fullWidth className={containerClassName}>
          <InputLabel id={"select-" + name}>{t(label)}</InputLabel>
          <Select
            disabled={disabled}
            labelId={"select-" + name}
            id={"select-" + name + "-outlined"}
            value={value}
            onChange={onChange}
            label={t(label)}
          >
            <MenuItem value="">
              <em>Aucun</em>
            </MenuItem>
            {options.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {translateLabel ? t(item.label) : item.label}
              </MenuItem>
            ))}
          </Select>
          {errors && errors[name] && <FormHelperText className={classes.error}>{t(errors[name] && t(errors[name].message))}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default CustomSelect;
