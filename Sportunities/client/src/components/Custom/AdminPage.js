import React from "react";
import { Container, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useGlobalStyles } from "../../config/theme";

const AdminPage = ({ title, children, rightButton }) => {

  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <Container maxWidth="lg">
      {(title || rightButton) &&
      <div className={globalStyles.justifyBetween}>
        {title &&
        <Typography component="h1" variant="h5" gutterBottom>
          {t(title)}
        </Typography>
        }
        {rightButton}
      </div>
      }
      {children}
    </Container>
  );
};

export default AdminPage;
