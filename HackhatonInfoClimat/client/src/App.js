import "./App.css";
import { createRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { IconButton, withStyles } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { RootProvider } from "./context/RootContext";
import RootRouter from "./RootRouter";

const styles = {
  snack: {
    top: 65,
  },
  info: { backgroundColor: "#1C1D24!important" },
};

const ref = createRef();
const onClickDismiss = key => () => {
  ref.current.closeSnackbar(key);
};

const App = ({ classes }) => {
  return (
    <SnackbarProvider
      ref={ref}
      autoHideDuration={3500}
      action={(key) => (
        <IconButton size="small" color="inherit" onClick={onClickDismiss(key)}>
          <Close/>
        </IconButton>
      )}
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      classes={{
        root: classes.snack,
        variantInfo: classes.info,
      }}
    >
      <RootProvider>
        <Router>
          <RootRouter/>
        </Router>
      </RootProvider>
    </SnackbarProvider>
  );
};

export default withStyles(styles)(App);
