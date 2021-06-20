import 'date-fns';
import React, { useState } from "react";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(-2),
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
}));

const CustomDatePicker = ({name, label, defaultValue = new Date()}) => {
  const [selectedDate, setSelectedDate] = useState(defaultValue);
  const classes = useStyles();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <FormControl fullWidth variant="outlined" className={classes.formControl}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          name={name}
          margin="normal"
          variant="inline"
          inputVariant="outlined"
          id={"select-" + name}
          label={label}
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </FormControl>
  );
};

export default CustomDatePicker;

