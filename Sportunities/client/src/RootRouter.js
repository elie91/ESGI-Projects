import React, { useEffect, useState, useMemo } from "react";
import { Route, Switch } from "react-router-dom";
import AdminRouter from "./components/Admin/AdminRouter";
import {
  RT_ADMIN,
  RT_AGENT,
  RT_ROOT,
} from "./config/routes";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Layout/Navigation";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AgentRouter from "./components/Agent/AgentRouter";
import UserRouter from "./components/User/UserRouter";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { fr } from "date-fns/locale"

const RootRouter = () => {

  const [color, setColor] = useState("#1C1D24");

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: color ? color : "#1C1D24",
          },
          secondary: {
            main: "#fff",
          },
          red: {
            main: "#fe2c55",
          },
          danger: {
            main: "#b2102f",
          },
          info: {
            main: "#f8f9fa",
          },
          grey: {
            main: "rgb(144, 144, 144)",
          },
          greyLight: {
            main: "rgb(249, 249, 249)",
          },
          darkLight: {
            main: "rgba(0, 0, 0, 0.55)",
          },
        },
        typography: {
          body1: {
            fontSize: ".85rem"
          },
          fontFamily: [
            "Roboto",
            "sans serif",
          ].join(","),
        },
        overrides: {
          MuiBreadcrumbs: {
            separator: {
              marginLeft: 0,
            },
          },
          MuiCard: {
            root: {
              height: "100%",
              borderRadius: 8,
              position: "relative"
            },
          },
          MuiCardActionArea: {
            root: {
              height: "100%",
            },
          },
          MuiCardContent: {
            root: {
              "&:last-child": {
                paddingBottom: "16px",
              },
            },
          },
          MuiTooltip: {
            tooltip: {
              backgroundColor: "#1C1D24",
              color: "#fff",
            },
            arrow: {
              color: "#1C1D24",
            },
          },
          MUIRichTextEditor: {
            root: {
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "4px",
            },
            container: {
              margin: "8px 0 8px 0",
            },
            editorContainer: {
              margin: 0,
              padding: "8px 0",
            },
            placeHolder: {
              position: "relative",
              padding: "8px 16px",
            },
            editor: {
              padding: "0 16px",
            },
          },
          MuiDivider: {
            root: {
              marginTop: "8px",
              marginBottom: "8px",
            },
          },
          variantInfo: {
            backgroundColor: "#1C1D24",
          },
        },
      }),
    [color],
  );

  useEffect(() => {
    // Set Color per Sport
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
        <Navigation setColor={setColor}/>
        <Switch>
          <PrivateRoute path={RT_AGENT} component={AgentRouter}/>
          <PrivateRoute path={RT_ADMIN} component={AdminRouter}/>
          <Route path={RT_ROOT} component={UserRouter}/>
        </Switch>
      </MuiPickersUtilsProvider>
    </ThemeProvider>

  );
};

export default RootRouter;
