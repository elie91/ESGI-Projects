import React from "react";
import { withStyles, Button, capitalize } from "@material-ui/core";

const ColorButton = withStyles(() => ({
  root: {
    textTransform: "initial",
  },
}))(Button);

const CapitalizeButton = ({ children, ...props }) => {
  return (
    <ColorButton {...props}>
      {capitalize(children)}
    </ColorButton>
  );
};

export default CapitalizeButton;
