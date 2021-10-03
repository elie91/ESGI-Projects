import React from "react";
import { TextField } from "@material-ui/core";
import { useTranslation } from "react-i18next";

/**
 * @param labelForm
 * @param name
 * @param errors
 * @param register
 * @param defaultValue
 * @param data
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const CustomTextField = ({ labelForm, name, errors, register, defaultValue, data = null, ...props }) => {

  const { t } = useTranslation();

  return (
    <TextField
      {...props}
      error={!!errors[name]}
      helperText={errors[name] && t(errors[name].message)}
      variant="outlined"
      fullWidth
      id={name}
      label={t(labelForm + "." + name)}
      name={name}
      inputRef={register}
      defaultValue={data ? data[name] ? data[name] : (defaultValue ? defaultValue : "") : (defaultValue ? defaultValue : "")}
    />
  );
};

export default CustomTextField;
