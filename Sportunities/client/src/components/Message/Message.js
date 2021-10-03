import React, { useState } from "react";
import { Button, Divider, IconButton, InputBase, Paper, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useGlobalStyles } from "../../config/theme";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import { MoreVert } from "@material-ui/icons";
import useMessage from "../../hooks/useMessage";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../helpers/Utils";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaMessage } from "../../config/schema";
import LoadingButton from "../Custom/Button/LoadingButton";
import CustomAvatar from "../Custom/CustomAvatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { isSameDay as isSameDayFunc } from "date-fns";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    "&:hover": {
      "& $more": {
        visibility: "initial",
      },
    },
  },
  containerButton: {
    display: "flex"
  },
  containerMessage: {
    width: "60%",
  },
  containerMore: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  message: {
    backgroundColor: "#eee",
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
  },
  messageSender: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
  containerSender: {
    justifyContent: "flex-end",
  },
  more: {
    visibility: "hidden",
  },
  owner: {
    fontSize: ".6875rem",
    color: "#B0B3B8",
  },
  wrap: {
    overflowWrap: "break-word",
  },
  button: {
    color: "#fff",
  },
  firstButton: {
    marginRight: theme.spacing(1),
  },
  containerInput: {
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: theme.spacing(2),
    marginRight: theme.spacing(1),
    padding: theme.spacing(.5, 1.5),
    marginBottom: theme.spacing(2),
  },
  divAvatar: {
    marginRight: theme.spacing(6),
  },
  time: {
    fontSize: "0.65rem",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  timeLeft: {
    marginLeft: 0,
    marginRight: theme.spacing(1),
  },
}));

const Message = ({ conversation, message, keyRef, isLast, getProfile, isSameOwner, isSameDay, isSameOwnerNext }) => {

  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const { user } = useAuth();
  const { actions } = useMessage();
  const [tooltip, setTooltip] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [edit, setEdit] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { register, handleSubmit, setError } = useForm({
    resolver: yupResolver(schemaMessage),
    defaultValues: {
      content: message.content,
    },
  });

  const isSender = message.owner === user.id;

  const onDelete = () => {
    actions.deleteMessage(message.id)
      .catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
  };

  const onEdit = () => {
    setEdit(message);
  };

  const onCancel = () => {
    setEdit(null);
    setTooltip(false);
  };

  const onSubmit = data => {
    setLoadingMessage(true);
    actions.updateMessage({
      id: message.id,
      content: data.content,
    }).then(() => {
      setLoadingMessage(false);
      setEdit(null);
      setTooltip(false);
    })
      .catch((e) => {
        formatErrors(e, setError, enqueueSnackbar);
        setLoadingMessage(false);
      });
  };

  const dateMessage = new Date(message.createdAt);

  return (
    <>
      {!isSameDay ?
        <div className={globalClasses.mb2}>
          <Typography
            align="center"
            color="textSecondary">
            {isSameDayFunc(dateMessage,  new Date()) ? t('experience.date.today') : format(dateMessage, "EEEE d MMM yyyy", { locale: fr })}
          </Typography>
        </div>
        : <></>}
      {!edit ?
        <div className={clsx(classes.container, isLast ? null : globalClasses.mb2)}>
          {(!isSender && !isSameOwner) ?
            <CustomAvatar className={globalClasses.mr1} user={getProfile(conversation)}/>
            : <div className={classes.divAvatar}/>}
          <div className={clsx(classes.containerMore, isSender ? classes.containerSender : null)}>
            {isSender &&
            <Tooltip
              key={keyRef}
              placement={"bottom"}
              arrow
              interactive
              open={tooltip}
              onClose={() => setTooltip(false)}
              onOpen={() => setTooltip(true)}
              title={
                <span className={classes.containerButton}>
                  <Button
                    onClick={onEdit}
                    className={clsx(classes.button, classes.firstButton)}
                    variant="text">
                    {t("button.edit")}
                  </Button>
                  <Button
                    onClick={onDelete}
                    size="small"
                    className={classes.button}
                    variant="text">
                    {t("button.delete")}
                  </Button>
                </span>
              }>
              <IconButton className={classes.more} size="small">
                <MoreVert/>
              </IconButton>
            </Tooltip>
            }

            <div className={classes.containerMessage}>
              {/*!isSender &&
                  <Typography className={classes.owner} gutterBottom>{getProfile(conversation).firstname}</Typography>
                 */}
              <Tooltip disableHoverListener title={"test"} placement={isSender ? "right" : "left"}>
                <Typography className={clsx(classes.message, classes.wrap, isSender ? classes.messageSender : null)}>
                  {message.content}
                </Typography>
              </Tooltip>
              {!isSameOwnerNext &&

              <Typography
                className={clsx(classes.time, isSender ? null : classes.timeLeft)}
                variant="body2"
                align={isSender ? "left" : "right"}
                color="textSecondary">
                {format(new Date(message.createdAt), "HH:ss")}
              </Typography>
              }
            </div>
          </div>
        </div>
        :
        <div className={globalClasses.mb2}>
          <Divider className={globalClasses.mb2}/>
          <Paper onSubmit={handleSubmit(onSubmit)} component="form" elevation={0}>
            <InputBase
              name="content"
              inputRef={register}
              disabled={loadingMessage}
              fullWidth
              className={classes.input}
              placeholder="Aa"
            />
            <div className={classes.containerInput}>
              <Button
                variant="outlined"
                color="primary"
                type="button"
                onClick={onCancel}>
                {t("button.cancel")}

              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
                noMargin
                loading={loadingMessage}>
                {t("button.update")}
              </LoadingButton>
            </div>
          </Paper>
        </div>
      }
    </>
  );
};

export default Message;
