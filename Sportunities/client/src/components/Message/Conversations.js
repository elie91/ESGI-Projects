import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
  useMediaQuery, useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Send, ArrowBack } from "@material-ui/icons";
import { useGlobalStyles } from "../../config/theme";
import clsx from "clsx";
import ListMessage from "./ListMessage";
import ListConversation from "./ListConversation";
import { useAuth } from "../../context/AuthContext";
import useConversation from "../../hooks/useConversation";
import useMessage from "../../hooks/useMessage";
import { MERCURE_HUB_URL } from "../../config/entrypoint";
import { formatErrors } from "../../helpers/Utils";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaMessage } from "../../config/schema";
import { ROLE_PLAYER } from "../../config/constant";
import { useTranslation } from "react-i18next";
import AdminPage from "../Custom/AdminPage";

const useStyles = makeStyles((theme) => ({
  cardFooter: {
    padding: theme.spacing(1),
  },
  card: {
    minHeight: "86vh",
  },
  conversation: {
    borderRight: "1px solid #eee",
    minHeight: "82vh",
  },
  containerInput: {
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: theme.spacing(2),
    marginRight: theme.spacing(1),
    padding: theme.spacing(.5, 1.5),
  },
  button: {
    color: "#fff",
  },
}));

const Conversations = () => {

  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const { actions } = useConversation();
  const { actions: actionsMessage } = useMessage();
  const { t } = useTranslation();
  const [conversation, setConversation] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { register, handleSubmit, setError, reset } = useForm({
    resolver: yupResolver(schemaMessage),
  });
  const ref = useRef(null);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    actions.getConversations()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
  }, []);

  useEffect(() => {
    const url = new URL(MERCURE_HUB_URL);
    if (user) {
      url.searchParams.append("topic", "http://caddy/users/" + user.id + "/conversations");
      url.searchParams.append("topic", "http://caddy/users/" + user.id + "/messages");
    }

    const eventSource = new EventSource(url);

    eventSource.onmessage = e => {
      if (e.data) {
        let data = JSON.parse(e.data);

        switch (data.entity) {
          case "message":
            switch (data.method) {
              case "post":
                actions.receiveConversationMessage(data, user);
                break;
              case "delete":
                actions.deleteConversationMessage(data);
                break;
              case "put":
                actions.updateConversationMessage(data);
                break;
              default:
                break;
            }
            break;
          case "conversation":
            actions.receiveConversation(data);
            break;
          default:
            break;
        }
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    };

    ref.current.scrollTop = ref.current.scrollHeight;

    if (ref) {
      ref.current.addEventListener("DOMNodeInserted", event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
    return () => {
      eventSource.close();
    };

  }, []);

  const sendMessage = (data) => {
    setLoadingMessage(true);
    actionsMessage.addMessage({
      content: data.content,
      owner: user.id,
      conversation: conversation.id,
    }, user).then(() => {
      reset();
      setLoadingMessage(false);
      ref.current.scrollTop = ref.current.scrollHeight;
    }).catch((e) => {
      formatErrors(e, setError, enqueueSnackbar);
      setLoadingMessage(false);
    });
  };

  const getProfile = (conversation) => {
    if (user.role.includes(ROLE_PLAYER)) {
      return conversation.userSender;
    }
    return conversation.userReceiver;
  };

  return (
    <AdminPage>
      <Card elevation={0} className={classes.card}>
        <div ref={ref} className={globalClasses.h100}>
          <Grid container spacing={0} className={globalClasses.h100}>
            {((conversation === null && mobile) || !mobile) &&

            <Grid item sm={4} xs={12} className={classes.conversation}>
              <div className={globalClasses.p2}>
                <Typography variant="h6">{t("navigation.conversations")}</Typography>
              </div>
              <ListConversation
                messageRef={ref}
                setConversation={setConversation}
                activeConversation={conversation}
                getProfile={getProfile}
              />
            </Grid>
            }
            <Grid item sm={8} xs={12}>
              {conversation &&
              <>
                <div className={clsx(globalClasses.justifyBetween, globalClasses.p2, globalClasses.borderBottom)}>
                  {mobile &&
                  <IconButton size="small" color="primary" onClick={() => setConversation(null)}>
                    <ArrowBack/>
                  </IconButton>
                  }
                  <div className={globalClasses.alignItemsCenter}>
                    <Typography variant="h6" className={globalClasses.cursorPointer}>
                      {getProfile(conversation).lastname + " " + getProfile(conversation).firstname}
                    </Typography>
                  </div>
                </div>
                <ListMessage innerRef={ref} conversation={conversation} getProfile={getProfile}/>
                <div className={classes.cardFooter}>
                  <Paper onSubmit={handleSubmit(sendMessage)} component="form" className={classes.containerInput}
                         elevation={0}>
                    <InputBase
                      name="content"
                      inputRef={register}
                      disabled={loadingMessage}
                      className={classes.input}
                      placeholder="Aa"
                    />
                    <IconButton disabled={loadingMessage} type="submit" color="primary">
                      <Send/>
                    </IconButton>
                  </Paper>
                </div>
              </>
              }
            </Grid>
          </Grid>
        </div>
      </Card>
    </AdminPage>
  );
};

export default Conversations;
