import React, { useState } from "react";
import FrontPage from "../../../Custom/FrontPage";
import { ROLE_AGENT, ROLE_PLAYER } from "../../../../config/constant";
import Type from "./Type";
import { RT_ROOT } from "../../../../config/routes";
import { Redirect } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useGlobalStyles } from "../../../../config/theme";
import Player from "./Player";
import Agent from "./Agent";

const NextStep = () => {

  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const { t } = useTranslation();
  const globalClasses = useGlobalStyles()

  const content = () => {
    switch (step) {
      case 0:
        return <Type role={role} setRole={setRole} setStep={setStep}/>;
      case 1:
        switch (role) {
          case ROLE_PLAYER:
            return <Player setRole={setRole} setStep={setStep}/>;
          case ROLE_AGENT:
            return <Agent setRole={setRole} setStep={setStep}/>;
          default:
            return <Redirect to={RT_ROOT}/>;
        }
      default:
        return <></>;
    }
  };

  return (
    <FrontPage
      title={"security.steps." + (step === 0 ? "type" : (role === ROLE_PLAYER ? "player" : "agent"))}
      maxWidth="md">
      {content()}
      {step === 0 &&
      <Typography className={globalClasses.mt2} color="primary" align="center">{t("security.steps.info")}</Typography>
      }
    </FrontPage>
  );
};

export default NextStep;
