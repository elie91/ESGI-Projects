import React, { useCallback } from "react";
import { Card, CardActionArea, CardContent, Grid, Typography } from "@material-ui/core";
import { PUBLIC_ROLES, ROLE_AGENT, ROLE_PLAYER, ROLE_USER } from "../../../../config/constant";
import { useTranslation } from "react-i18next";
import { ReactComponent as UserIcon } from "../../../../assets/svg/user.svg";
import { ReactComponent as PlayerIcon } from "../../../../assets/svg/player.svg";
import { ReactComponent as AgentIcon } from "../../../../assets/svg/agent.svg";
import { iconSize, useGlobalStyles } from "../../../../config/theme";
import clsx from "clsx";
import { useAuth } from "../../../../context/AuthContext";
import { formatErrors } from "../../../../helpers/Utils";
import { useSnackbar } from "notistack";

const Type = ({ setStep, role, setRole }) => {

  const { t } = useTranslation();
  const { actions, user } = useAuth();
  const globalClasses = useGlobalStyles();
  const { enqueueSnackbar } = useSnackbar();

  const getImageByRole = useCallback((role) => {
    switch (role) {
      case ROLE_USER:
        return <UserIcon width={iconSize} height={iconSize}/>;
      case ROLE_AGENT:
        return <AgentIcon width={iconSize} height={iconSize}/>;
      case ROLE_PLAYER:
        return <PlayerIcon width={iconSize} height={iconSize}/>;
      default:
        return null;
    }
  }, []);

  const handleChange = (role) => {
    switch (role) {
      case ROLE_USER:
        actions.update({
          id: user.id,
          hasChosenRole: true,
        }).then(() => {
          enqueueSnackbar(t("security.chosen"), { variant: "success" });
          setRole(role);
          setStep(prev => prev + 1);
        }).catch(e => formatErrors(e, null, enqueueSnackbar));
        break;
      case ROLE_AGENT:
      case ROLE_PLAYER:
        setRole(role);
        setStep(prev => prev + 1);
        break;
      default:
        break;
    }

  };

  return (
    <Grid container spacing={2} className={globalClasses.mt2}>
      {PUBLIC_ROLES.map((r, index) =>
        <Grid key={index} item sm={4}>
          <Card
            elevation={0}
            className={clsx(globalClasses.textCenter, role === r ? globalClasses.cardSelected : null)}
            onClick={() => handleChange(r)}>
            <CardActionArea>
              <CardContent>
                {getImageByRole(r)}
                <Typography
                  className={globalClasses.mt2}
                  variant="h5"
                  component="h3"
                  gutterBottom>
                  {t("user.roles." + r + ".name")}
                </Typography>
                <Typography>{t("user.roles." + r + ".description")}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>,
      )}
    </Grid>
  );
};

export default Type;
