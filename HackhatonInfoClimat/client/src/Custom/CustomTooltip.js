import { Tooltip, withStyles } from "@material-ui/core";

export const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "rgba(0, 0, 0, 0.87)",
    color: theme.palette.common.white,
    fontSize: 13,
  },
}))(Tooltip);


