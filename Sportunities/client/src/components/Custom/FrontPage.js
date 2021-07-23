import React from "react";
import { Container, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useGlobalStyles } from "../../config/theme";
import clsx from "clsx";

const FrontPage = ({ title, children, maxWidth = "sm", alignTitle = "center", leftButton, rightButton }) => {

  const { t } = useTranslation();
  const classes = useGlobalStyles();

  return (
    <Container maxWidth={maxWidth} className={classes.mt10}>
      {(rightButton || leftButton) ?
        <div className={clsx(classes.justifyBetween, classes.mb1)}>
          {leftButton}
          <Typography component="h2" variant="h5" align={alignTitle}>
            {t(title)}
          </Typography>
          {rightButton}
        </div>
        : <Typography component="h2" variant="h5" gutterBottom align={alignTitle}>
          {t(title)}
        </Typography>
      }

      {children}
    </Container>
  );
};

export default FrontPage;
