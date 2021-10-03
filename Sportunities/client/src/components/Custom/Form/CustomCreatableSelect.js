import React from "react";
import { FormControl, InputLabel, Typography, useTheme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { customStylesSelect } from "../../../config/theme";

const useCreatableSelect = makeStyles((theme) => ({
  label: {
    backgroundColor: "#fff",
    padding: theme.spacing(0, 1),
  },
}));

const CustomCreatableSelect = ({
  name,
  label,
  defaultValue,
  options,
  control,
  placeholder,
  createLabel,
}) => {

  const { t } = useTranslation();
  const classes = useCreatableSelect();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ? defaultValue : []}
      render={props =>
        <FormControl variant="outlined" fullWidth>
          <InputLabel shrink={true} className={classes.label}>{t(label)}</InputLabel>
          <CreatableSelect
            styles={customStylesSelect}
            name={name}
            isMulti
            theme={t => ({
              ...t,
              fontFamily: "Roboto",
              colors: {
                ...t.colors,
                primary: theme.palette.primary.main,
              },
            })}
            value={props.value}
            onChange={props.onChange}
            options={options}
            placeholder={<Typography>{t(placeholder)}</Typography>}
            noOptionsMessage={() => <Typography>{t("select.noOptions")}</Typography>}
            formatCreateLabel={() => <Typography>{t(createLabel ? createLabel : "select.create")}</Typography>}

          />
        </FormControl>
      }
    />
  );
};

export default CustomCreatableSelect;
