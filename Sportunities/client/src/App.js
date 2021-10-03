import React, { createRef } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { RootProvider } from "./context/RootContext";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import RootRouter from "./RootRouter";
import { SnackbarProvider } from "notistack";
import { IconButton, withStyles } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const styles = {
  root: {
    top: 70,
  },
  info: { backgroundColor: "#1C1D24!important" },
};

const ref = createRef();
const onClickDismiss = key => () => {
  ref.current.closeSnackbar(key);
};

const App = ({ classes }) => {
  return (
    <ErrorBoundary>
      <SnackbarProvider
        ref={ref}
        autoHideDuration={3500}
        action={(key) => (
          <IconButton size="small" color="inherit" onClick={onClickDismiss(key)}>
            <Close/>
          </IconButton>
        )}
        disableWindowBlurListener
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{
          containerRoot: classes.root,
          variantInfo: classes.info,
        }}
      >

        <AuthProvider>
          <RootProvider>
            <Router>
              <RootRouter/>
            </Router>
          </RootProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  );
};


export default withStyles(styles)(App);
