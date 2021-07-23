import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  pulse: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    margin: theme.spacing(1),
    display: "inline-flex",
    boxShadow: "0 0 0 0 rgba(244, 67, 53, 1)",
    backgroundColor: theme.palette.error.main,
    borderRadius: "100%",
    "-webkit-animation": "$sk-scaleout 1.0s infinite ease-in-out",
    animation: "$sk-scaleout 1.0s infinite ease-in-out",
  },
  "@keyframes sk-scaleout": {
    "0%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(244, 67, 53, 0.7)",
    },
    "70%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 4px rgba(244, 67, 53, 0)",
    },
    "100%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(244, 67, 53, 0)",
    },
  },
}));

const Pulse = () => {

  const classes = useStyles();

  return (
    <div className={classes.pulse}/>
  );
};

export default Pulse;
