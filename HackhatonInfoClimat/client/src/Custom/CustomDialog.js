import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  topRight: {
    position: "absolute!important",
    top: 0,
    right: 0,
  },
}));

const CustomDialog = ({ handleClose, open, title, children }) => {
  const classes = useStyles();

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <IconButton size="medium" className={classes.topRight} onClick={handleClose} color="primary">
          <Close style={{ fontSize: "1.5rem" }}/>
        </IconButton>
        <Typography
          variant="body1"
          component="div"
          gutterBottom>
          {title}
        </Typography>
        <Divider/>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
