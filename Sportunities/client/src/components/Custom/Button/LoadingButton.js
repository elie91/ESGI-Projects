import React from "react";
import { makeStyles, Button, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -5,
    marginLeft: -12,
    color: "#fff",
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}));

const LoadingButton = ({ loading, onClick, children, noMargin = false, ...props }) => {

  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Button
        {...props}
        className={props.className ? props.className : !noMargin ? classes.submit : null}
        disabled={loading}
        onClick={onClick}
      >
        {children}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
    </div>
  );
};

export default LoadingButton;
