import React from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { FormControl } from "@material-ui/core";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const RangeSlider = ({ name, label, min, max, defaultValue = [min, max], containerClassName, control }) => {

  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ onChange, value }) => (
        <FormControl variant="outlined" fullWidth className={containerClassName}>
          <Typography id="range-slider" gutterBottom>
            {t(label)}
          </Typography>
          <Slider
            style={{ width: "97%" }}
            value={value}
            label={label}
            min={min}
            max={max}
            onChange={(_, value) => {
              onChange(value);
            }}
            aria-labelledby="range-slider"
            valueLabelDisplay="auto"
          />
        </FormControl>
      )}
    />
  );
};

export default RangeSlider;
