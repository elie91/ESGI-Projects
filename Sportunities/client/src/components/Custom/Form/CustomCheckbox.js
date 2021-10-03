import React from "react";
import { Checkbox, FormControl, FormControlLabel } from "@material-ui/core";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const CustomCheckbox = ({ name, label, defaultValue = false, containerClassName, control }) => {

  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ onChange, value }) => (
        <FormControl variant="outlined" fullWidth className={containerClassName}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={value}
                onChange={(_, value) => {
                  onChange(value);
                }}
                name="checked"
              />
            }
            label={t(label)}
          />
        </FormControl>
      )}
    />
  );
};

export default CustomCheckbox;
