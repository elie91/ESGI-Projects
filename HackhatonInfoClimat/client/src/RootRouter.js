import React, {useState, useMemo} from "react";
import {Route, Switch} from "react-router-dom";
import {
  RT_EVENTS,
  RT_ROOT,
} from "./config/routes";
import Navigation from "./components/Navigation";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import Events from "./components/Events/Events";
import Home from "./components/Home/Home";
import {CssBaseline} from "@material-ui/core";

const RootRouter = () => {

  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [color, setColor] = useState("#444488");

  const theme = useMemo(
      () =>
          createMuiTheme({
            palette: {
              primary: {
                main: color ? color : "#444488",

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
                  backgroundColor: "#444488",
                  color: "#fff",
                },
                arrow: {
                  color: "#444488",
                },
              },
              MuiDivider: {
                root: {
                  marginTop: "8px",
                  marginBottom: "8px",
                },
              },
              variantInfo: {
                backgroundColor: "#444488",
              },
            },
          }),
      [color],
  );

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Navigation isMobileNavOpen={isMobileNavOpen} setMobileNavOpen={setMobileNavOpen} setColor={setColor}/>
        <Switch>
          <Route path={RT_ROOT} exact component={Home}/>
          <Route path={RT_EVENTS} exact component={Events}/>
        </Switch>
      </ThemeProvider>
  );
};

export default RootRouter;
