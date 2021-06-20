import React, {useCallback, useEffect, useState} from "react";
import CustomSelect from "../custom/CustomSelect";
import CustomDatePicker from "../custom/CustomDatePicker";
import {FILTER_VALUES, FILTERS, FILTER_VALUES_OPERATORS} from "../../config/constants";
import {Card, CardContent, Divider, Grid, Typography, FormControl, OutlinedInput, InputAdornment} from "@material-ui/core";
import useEvent from "../../hooks/useEvent";
import {debounce, getTemperatureCorrespondance} from "../../helpers/Utils";

const Filters = ({open, setOpen}) => {

  const {actions} = useEvent();
  const [filters, setFilters] = useState({});
  const [filtersValue, setFiltersValue] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [unitOperator, setUnitOperator] = useState("");

  useEffect(() => {
    actions.getEvents(filters).catch(e => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onFilterValuesChange = (event) => {
    setFiltersValue(event.target.value);
    const correspondance = getTemperatureCorrespondance(event.target.value);
    if (correspondance) {
      setUnitLabel(correspondance.unit);
    }
  }

  const onFilterChange = (event, name) => {
    setFilters(prev => {
      return {
        ...prev,
        [name]: event.target.value
      };
    });
  };


  const fetchByFilters = useCallback(
      debounce((type, operator, value) => {
        actions.getEventsHistoricValues({type, operator, value})
      }, 1000),
      [],
  );

  useEffect(() => {
    if (filtersValue.length > 0 && unitOperator.length > 0 && unitValue.length > 0) {
      fetchByFilters(filtersValue, unitOperator, unitValue)
    }
  }, [filtersValue, unitOperator, unitValue])


  return (
      <Card elevation={0} style={{height: "auto", overflowY: "scroll"}}>
        <CardContent>
          {FILTERS.map(group =>
              <Grid container key={group.name} spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">{group.name}</Typography>
                </Grid>
                {group.filters.map((filter, index) =>
                    <Grid key={index} item sm={filter.col ? filter.col : 12}>
                      {filter.isDate ? <CustomDatePicker key={index} name={filter.name} label={filter.label}/> :
                          <CustomSelect
                              name={filter.name}
                              label={filter.label}
                              options={filter.values}
                              onChange={onFilterChange}
                          />}
                    </Grid>,
                )}
                <Grid item xs={12}>
                  <Divider/>
                </Grid>
              </Grid>,
          )}
          <CustomSelect
              label="Type"
              name="type"
              options={FILTER_VALUES}
              onChange={onFilterValuesChange}
          />
          <CustomSelect
              label="Opérateurs"
              name="operators"
              options={FILTER_VALUES_OPERATORS}
              onChange={(event) => setUnitOperator(event.target.value)}
          />
          <OutlinedInput
              fullWidth
              id="value"
              value={unitValue}
              onChange={(event) => setUnitValue(event.target.value)}
              endAdornment={<InputAdornment position="end">{unitLabel}</InputAdornment>}
              aria-describedby="value with unit"
              inputProps={{
                'aria-label': 'weight',
              }}
          />

        </CardContent>
      </Card>
  );
};

export default Filters;
