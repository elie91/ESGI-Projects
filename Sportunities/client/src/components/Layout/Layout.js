import React from "react";
import { Container, makeStyles, Breadcrumbs, Typography, useTheme } from "@material-ui/core";
import Sidebar from "../Layout/Sidebar";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { drawerWidth } from "../../config/theme";
import CapitalizeButton from "../Custom/Button/CapitalizeButton";
import { useAuth } from "../../context/AuthContext";
import { ROLE_ADMIN, ROLE_AGENT } from "../../config/constant";
import { RT_ADMIN, RT_AGENT } from "../../config/routes";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    width: "100%",
    minHeight: "calc(100vh - 64px)",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: drawerWidth,
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    minHeight: "calc(100vh - " + theme.spacing(8) + "px)",

    paddingTop: theme.spacing(8),
  },
  content: {
    flex: "1 1 auto",
    backgroundColor: theme.palette.info.main,
    paddingBottom: theme.spacing(2),
  },
  breadcrumb: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  fontSize: {
    fontSize: ".85rem",
  },
}));

const Layout = ({ sidebarItems, setColor, displayBreadcrumbs = true, children }) => {

  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const breadcrumbs = location.pathname.split("/").filter(item => item !== "");
  let generatedLink = "";
  const history = useHistory();

  const getDashboard = () => {
    let link = "#";
    if (user) {
      if (user.role.includes(ROLE_ADMIN)) {
        link = RT_ADMIN;
      }
      if (user.role.includes(ROLE_AGENT)) {
        link = RT_AGENT;
      }
    }
    return link;
  };

  return (
    <div className={classes.root}>
      <Sidebar
        setColor={setColor}
        sidebarItems={sidebarItems}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content} style={{ marginTop: !displayBreadcrumbs ? theme.spacing(2) : 0 }}>
            {displayBreadcrumbs &&
            <Container maxWidth="lg">
              <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
                {breadcrumbs.map((link, index, array) => {
                  if (!link.match(new RegExp("^\\d+$"))) {
                    if (index < array.length - 1) {
                      generatedLink = generatedLink + "/" + link;
                    }
                    if (index === 0) {
                      return (
                        <CapitalizeButton
                          variant="text"
                          key={index}
                          color="inherit"
                          onClick={() => history.push(getDashboard())}>
                          {t("navigation.home")}
                        </CapitalizeButton>
                      );
                    } else {
                      return (
                        array.length - 1 === index ?
                          <Typography
                            key={index}
                            color="textPrimary"
                            className={classes.fontSize}>{t("navigation." + link)}</Typography>
                          :
                          <CapitalizeButton
                            variant="text"
                            key={index}
                            color="inherit"
                            onClick={() => history.push(generatedLink)}>
                            {t("navigation." + link)}
                          </CapitalizeButton>
                      );
                    }
                  } else {
                    generatedLink += "";
                  }
                  return null;
                })}
              </Breadcrumbs>
            </Container>
            }
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
