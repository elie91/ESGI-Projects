import React from "react";
import { withStyles, Button } from "@material-ui/core";

const ColorButton = withStyles(() => ({
  root: {
    color: "#fff",
    backgroundColor: "#cc0e00",
    "&:hover": {
      backgroundColor: "#cc0e00",
    },
  },
}))(Button);

const ErrorButton = ({ children, ...props }) => {
  return (
    <ColorButton {...props}>
      {children}
    </ColorButton>
  );
};

export default ErrorButton;
