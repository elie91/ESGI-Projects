import React, { useEffect, useState } from "react";
import { formatErrors, ucFirst } from "../../../helpers/Utils";
import { useParams } from "react-router-dom";
import AdminPage from "../../Custom/AdminPage";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useAgent from "../../../hooks/useAgent";
import {
  Button,
  Card,
  CardContent,
  Grid, IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DescriptionIcon from "@material-ui/icons/Description";
import { GetApp } from "@material-ui/icons";
import { useGlobalStyles } from "../../../config/theme";
import CustomAvatar from "../../Custom/CustomAvatar";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";
import clsx from "clsx";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 80,
    width: 80,
  },
  name: {
    lineHeight: 1.25,
  },
}));

const EditAgent = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  let params = useParams();
  const { actions } = useAgent();
  const [data, setData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    actions.fetchAgent(params.id)
      .then((data) => {
        if (!isCancelled) {
          setData({
            ...data,
          });
          setLoading(false);
        }
      }).catch((err) => {
      if (!isCancelled) {
        setLoading(false);
        formatErrors(err, null, enqueueSnackbar);
      }
    });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = (value) => {
    actions.updateAgent({
      isConfirmed: value,
      id: data.id,
      confirmedAt: new Date(),
    })
      .then((result) => {
        setData(prev => {
          return {
            ...prev,
            confirmedAt: result.confirmedAt,
            isConfirmed: result.isConfirmed,
          };
        });

      }).catch(e => {
      formatErrors(e, null, enqueueSnackbar);
    });
  };

  return (
    <AdminPage title="user.update" rightButton={
      <div className={globalClasses.alignItemsCenter}>
        {data &&
        <>
          {data.confirmedAt === null ?
            <>
              <Button variant="outlined" onClick={() => onClick(false)}>
                {t("club.disapproved")}
              </Button>
              <Button className={globalClasses.ml1} color="primary" variant="contained" onClick={() => onClick(true)}>
                {t("club.approved")}
              </Button>
            </>
            : <Typography>{t("club." + (data.isConfirmed ? "approved" : "disapproved"))}</Typography>
          }
        </>
        }
      </div>
    }>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card elevation={0}>
            <CardContent>
              {loading ? <Skeleton height={200} width="100%"/> :
                <>
                  {data &&
                  <>
                    <div className={clsx(globalClasses.alignItemsCenter, globalClasses.mb2)}>
                      <CustomAvatar className={classes.avatar} user={data.user}/>
                      <div className={globalClasses.ml1}>
                        <Typography
                          className={classes.name}
                          variant="subtitle1">{ucFirst(data.user.lastname)}</Typography>
                        <Typography
                          className={classes.name}
                          variant="subtitle1">{ucFirst(data.user.firstname)}</Typography>
                      </div>

                    </div>
                    <Typography
                      variant="body1"
                      gutterBottom>{t("agent.birthday", { date: format(new Date(data.user.birthday), "dd/MM/yyyy") })}</Typography>
                    <Typography
                      variant="body1"
                      gutterBottom>{t("agent.club", { club: data.club.name })}</Typography>
                  </>
                  }
                </>
              }
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={0}>
            <CardContent>
              {loading ? <Skeleton height={200} width="100%"/> :
                <>
                  <Typography variant="h6" gutterBottom>{t("agent.documents.title")}</Typography>
                  <List>
                    {data && data.user.documents.map((document, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <DescriptionIcon/>
                        </ListItemIcon>
                        <ListItemText primary={t(document.name)}/>
                        <ListItemSecondaryAction>
                          <IconButton component="a" href={document.base64} download edge="end" aria-label="download">
                            <GetApp/>
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </>
              }
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </AdminPage>
  );
}
;

export default EditAgent;
