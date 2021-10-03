import React, { useEffect, useState } from "react";
import { Container, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useGlobalStyles } from "../../config/theme";
import { MERCURE_HUB_URL } from "../../config/entrypoint";

const steps = ["agent.steps.1", "agent.steps.2", "agent.steps.3.wait"];

const Dashboard = () => {

    const { user, actions } = useAuth();
    const globalClasses = useGlobalStyles();
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
      if (!user) return;
      setActiveStep(user.agent.confirmedAt !== null ? 2 : 1);
    }, []);

    useEffect(() => {
      const url = new URL(MERCURE_HUB_URL);
      if (user) {
        url.searchParams.append("topic", "http://caddy/agents/" + user.agent.id);
      }

      const eventSource = new EventSource(url);

      eventSource.onmessage = e => {
        if (e.data) {
          let data = JSON.parse(e.data);

          switch (data.entity) {
            case "agent":
              switch (data.method) {
                case "put":
                  actions.receiveUpdateAgent(data);
                  setActiveStep(2);
                  break;
                default:
                  break;
              }
              break;
            default:
              break;
          }
        }
      };

      return () => {
        eventSource.close();
      };

    }, []);

    return (
      <Container component="main">
        {user && user.agent.isConfirmed ?
          <>
            <Typography component="h1" variant="h5" gutterBottom>
              Dashboard
            </Typography>
          </>
          :
          <>
            <Typography component="h1" variant="h5" gutterBottom>
              {t("agent.steps.title")}
            </Typography>
            <div className={globalClasses.mt2}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const labelProps = {};
                    if (steps.length - 1 === index && user.agent.confirmedAt !== null && !user.agent.isConfirmed) {
                      labelProps.error = true;
                    }
                    return (
                      <Step key={label}>
                        <StepLabel {...labelProps}>{steps.length - 1 === index ?
                          <>
                            {user.agent.confirmedAt !== null ?
                              <>
                                {user.agent.isConfirmed ? t(label.replace("wait", "success")) : t(label.replace("wait", "error"))}
                              </>
                              : t(label)}
                          </>
                          : t(label)}
                        </StepLabel>
                      </Step>
                    );
                  },
                )}
              </Stepper>
            </div>
          </>
        }
      </Container>
    );
  }
;

export default Dashboard;
