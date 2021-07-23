import React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  makeStyles,
  IconButton, Typography, useMediaQuery, useTheme,
} from "@material-ui/core";
import ErrorButton from "./Button/ErrorButton";
import { useTranslation } from "react-i18next";
import { Close } from "@material-ui/icons";
import LoadingButton from "./Button/LoadingButton";

const useStyles = makeStyles((theme) => ({
  header: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    marginBottom: theme.spacing(1),
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const CustomDialog = ({
  id = "default",
  open,
  setOpen,
  title,
  children,
  maxWidth = "md",
  onSubmit,
  cancelButton = true,
  errorButton = false,
  textSubmitButton = "button.confirm",
  handleSubmit = false,
  loading = false,
}) => {

  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const SubmitButton = errorButton ? ErrorButton : LoadingButton;

  const content = (
    <>
      <DialogTitle className={classes.header} id={"form-dialog-" + id}>
        <div className={classes.title}>
          <Typography variant="h6" component="span">{t(title)}</Typography>
          <IconButton size="small" onClick={() => setOpen(false)} color="primary">
            <Close fontSize="large"/>
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        {cancelButton &&
        <Button onClick={() => setOpen(false)} color="default">
          {t("button.cancel")}
        </Button>
        }
        {handleSubmit ?
          <SubmitButton loading={loading} variant="contained" color="primary" type="submit">
            {t(textSubmitButton)}
          </SubmitButton>
          :
          <SubmitButton loading={loading} onClick={onSubmit} variant="contained" color="primary" type="submit">
            {t(textSubmitButton)}
          </SubmitButton>}

      </DialogActions>
    </>
  );

  return (
    <Dialog
      fullScreen={mobile}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby={"form-dialog-" + id}
      maxWidth={maxWidth} fullWidth={!!maxWidth}
    >
      {handleSubmit ?
        <form onSubmit={handleSubmit(onSubmit)}>
          {content}
        </form>
        :
        content
      }
    </Dialog>
  );
};

export default CustomDialog;
