import React from "react";
import { List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import useConversation from "../../hooks/useConversation";
import { shortDescription } from "../../helpers/Utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { ROLE_PLAYER } from "../../config/constant";
import Pulse from "../Custom/Loaders/Pulse";
import { useGlobalStyles } from "../../config/theme";
import CustomAvatar from "../Custom/CustomAvatar";
import { makeStyles } from "@material-ui/core/styles";
import LoaderConversations from "./LoaderConversations";

const useStyles = makeStyles(() => ({
  messages: {
    height: "78vh",
    overflowY: "scroll",
  },
}));

const ListConversation = ({ setConversation, activeConversation, messageRef, getProfile }) => {

  const { selectors, actions } = useConversation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  const onClick = (conversation) => {
    setConversation(conversation);
    actions.showConversation(conversation);
    if (messageRef.current){
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  const isActive = (current) => {
    if (activeConversation) {
      return current.id === activeConversation.id;
    }
    return false;
  };

  return (
    <List className={classes.messages} disablePadding>
      {selectors.isLoading() && <LoaderConversations/>}
      {!selectors.isLoading() && selectors.getConversations().map((conversation, index) =>
        <ListItem selected={isActive(conversation)} key={index} button onClick={() => onClick(conversation)}>
          <ListItemAvatar>
            <CustomAvatar user={getProfile(conversation)}/>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                {getProfile(conversation).lastname + " " + getProfile(conversation).firstname}
                <Typography
                  variant="body2"
                  component="span"
                  color="textSecondary"> - {format(new Date(conversation.updatedAt), "HH:mm")}</Typography>
              </>}
            secondary={conversation.messages && conversation.messages.length > 0 ? shortDescription(conversation.messages[conversation.messages.length - 1].content, 20) : "Ecrire le premier message..."}
          />
          <ListItemText className={globalClasses.textRight}>
            {conversation.hasNewMessage && !isActive(conversation) && <Pulse/>}
          </ListItemText>
        </ListItem>,
      )}
      {selectors.isEmpty() &&
      <ListItem>
        <ListItemText
          className={globalClasses.textCenter}
          primary={t("conversation.empty." + (user.role.includes(ROLE_PLAYER) ? "player" : "agent"))}
        />
      </ListItem>
      }
    </List>
  );
};

export default ListConversation;


