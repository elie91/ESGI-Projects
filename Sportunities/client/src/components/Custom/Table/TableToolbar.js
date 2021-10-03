import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { makeStyles, Grid, TextField, IconButton, Tooltip, Typography, Toolbar, Button } from "@material-ui/core";
import { Cached, Delete } from "@material-ui/icons";
import { useGlobalStyles } from "../../../config/theme";

const useToolbarStyles = makeStyles((theme) => ({
  highlight: {
    color: "#fff",
    backgroundColor: theme.palette.error.main,
  },
  button: {
    height: "100%",
  },
  alignRight: {
    textAlign: "right",
  },
  animated: {
    animation: `$rotating 2s linear infinite`,
  },
  "@keyframes rotating": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const CustomTableToolbar = ({
  title,
  refresh,
  onRefresh,
  AddLink,
  onDelete,
  iconLabel,
  keyTranslate,
  onSearch,
  filters = null,
  ...props
}) => {
  const classes = useToolbarStyles();
  const globalStyles = useGlobalStyles();
  const { numSelected } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();

  return (
    <Toolbar className={clsx({ [classes.highlight]: numSelected > 0 }, globalStyles.px2)}>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item sm={5} xs={12}>
          {numSelected > 0 ? (
            <Typography color="inherit">
              {numSelected} {t("selected")}
            </Typography>
          ) : (
            <Grid container spacing={2} alignItems="center">
              <Grid item sm={filters ? 6 : 12} xs={12}>
                <Typography variant="h6">
                  {title}
                </Typography>
              </Grid>
              {filters &&
              <Grid item sm={6}>
                {filters}
              </Grid>
              }
            </Grid>
          )}
        </Grid>
        <Grid item sm={7} xs={12}>
          <Grid container spacing={2} alignItems="center">
            {!AddLink && <Grid item sm={5} xs={6}/>}
            <Grid item sm={6} xs={12}>
              {numSelected === 0 && <TextField
                className={globalStyles.mr1}
                error={!!errors.search}
                helperText={errors.search && t(errors.search.message)}
                variant="outlined"
                fullWidth
                size="small"
                id="full_text"
                label={t(keyTranslate + ".search")}
                name="full_text"
                inputRef={register}
                onChange={handleSubmit(onSearch)}
              />}
            </Grid>
            {AddLink &&

            <Grid item sm={(numSelected > 0 || onRefresh) ? 5 : 6} xs={12} className={classes.alignRight}>
              {numSelected === 0 &&
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => history.push(AddLink)}>
                {iconLabel}
              </Button>
              }
            </Grid>
            }
            {(numSelected > 0 || onRefresh) &&
            <Grid item sm={1} xs={1}>
              {numSelected > 0 ? (onDelete &&
                <Tooltip title={t("delete")}>
                  <IconButton size="small" color="inherit" aria-label={t("button.delete")} onClick={onDelete}>
                    <Delete/>
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  {onRefresh &&
                  <Tooltip title={t("refresh")}>
                    <IconButton size="small" color="inherit" aria-label={t("button.refresh")} onClick={onRefresh}>
                      <Cached className={clsx(refresh ? classes.animated : {})}/>
                    </IconButton>
                  </Tooltip>
                  }
                </>
              )}
            </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

CustomTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default CustomTableToolbar;
