import React, { useState } from "react";
import { InputAdornment, TextField, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const PasswordField = ({ field, errors, label, register, autoComplete }) => {

  const { t } = useTranslation();
  const [display, setDisplay] = useState(false);

  return (
    <TextField
      error={!!errors[field]}
      helperText={errors[field] && t(errors[field].message)}
      variant="outlined"
      required
      fullWidth
      name={field}
      label={t(label)}
      type={display ? "text" : "password"}
      id={field}
      autoComplete={autoComplete}
      inputRef={register}
      InputProps={{
        endAdornment: <InputAdornment position="end">
          <IconButton
            aria-label={t("user.showPassword")}
            onClick={() => setDisplay(!display)}
            onMouseDown={() => setDisplay(false)}
          >
            {display ? <Visibility/> : <VisibilityOff/>}
          </IconButton>
        </InputAdornment>,
      }}
    />
  );
};

export default PasswordField;
