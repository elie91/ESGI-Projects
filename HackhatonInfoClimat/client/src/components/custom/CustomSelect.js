import React, { useState } from "react";
import { makeStyles, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CustomSelect = ({ name, label, options, onChange }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event, name)
  };

  return (
    <FormControl fullWidth variant="outlined" className={classes.formControl}>
      <InputLabel id={"label-" + name}>{label}</InputLabel>
      <Select
        fullWidth
        labelId={"label-" + name}
        id={"select-" + name}
        value={value}
        onChange={handleChange}
        label={label}
      >
        <MenuItem value="">
          <em>Aucun</em>
        </MenuItem>

        {options.map((text, index) => (
          <MenuItem key={index} value={text.value}> {text.name} </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
