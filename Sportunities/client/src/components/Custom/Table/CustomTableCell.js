import { TableCell } from "@material-ui/core";
import { theme } from "../../../config/theme";

const { withStyles } = require("@material-ui/core");

export const CustomTableCell = withStyles({
  root: {
    borderBottom: 0,
    padding: theme.spacing(0.5, 0),
  },
})(TableCell);
