import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ErrorButton from "../Button/ErrorButton";
import { useTranslation } from "react-i18next";

const ModalDelete = ({ open, setOpen, getNameItemDelete, handleClose, message = "dialog.delete.content" }) => {

  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="dialog-delete-title"
      aria-describedby="dialog-delete-description"
    >
      <DialogTitle
        id="dialog-delete-title">{t("dialog.delete.title", { name: getNameItemDelete() })}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-delete-description">
          {t(message, { name: getNameItemDelete() })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpen(false)} color="primary">
          {t("button.cancel")}
        </Button>
        <ErrorButton variant="contained" onClick={handleClose} autoFocus>
          {t("button.confirm")}
        </ErrorButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;
