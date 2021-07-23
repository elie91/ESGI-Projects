import React from "react";
import { FormControl, FormHelperText, InputLabel, Typography, useTheme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { customStylesSelect } from "../../../config/theme";

const useCreatableSelect = makeStyles((theme) => ({
  label: {
    backgroundColor: "#fff",
    padding: theme.spacing(0, 1),
  },
  error: {
    color: theme.palette.error.main
  }
}));

const CustomSearchSelect = ({
    name,
    label,
    defaultValue,
    options,
    errors,
    control,
    placeholder,
    disabled,
    createLabel,
    marginBottom = false,
  }) => {

    const { t } = useTranslation();
    const classes = useCreatableSelect();
    const theme = useTheme();

    return (

      <Controller
        required
        name={name}
        control={control}
        defaultValue={defaultValue ? defaultValue : ""}
        render={props =>
          <FormControl variant="outlined" fullWidth style={{ marginBottom: marginBottom ? 16 : 0 }}>
            <InputLabel shrink={true} className={classes.label}>{t(label)}</InputLabel>
            <Select
              isDisabled={disabled}
              styles={customStylesSelect}
              name={name}
              theme={t => ({
                ...t,
                fontFamily: "Roboto",
                colors: {
                  ...t.colors,
                  primary: theme.palette.primary.main,
                },
              })}
              value={options.find(item => props.value === item.value)}
              onChange={(e) => props.onChange(e.value)}
              options={options}
              placeholder={<Typography>{t(placeholder)}</Typography>}
              noOptionsMessage={() => <Typography>{t("select.noOptions")}</Typography>}
              formatCreateLabel={() => <Typography>{t(createLabel ? createLabel : "select.create")}</Typography>}

            />
            {errors && errors[name] &&<FormHelperText className={classes.error}>{t(errors[name] && t(errors[name].message))}</FormHelperText>}
          </FormControl>
        }
      />
    );
  }
;

export default CustomSearchSelect;
