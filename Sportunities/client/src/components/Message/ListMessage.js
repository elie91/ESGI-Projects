import React, { useEffect } from "react";
import Message from "./Message";
import useConversation from "../../hooks/useConversation";
import { useGlobalStyles } from "../../config/theme";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { isSameDay as isSameDayFunc } from "date-fns";

const useStyles = makeStyles((theme) => ({
  messages: {
    height: "65vh",
    overflowY: "scroll",
  },
}));

const ListMessage = ({ conversation, innerRef, getProfile }) => {

  const { selectors } = useConversation();
  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  useEffect(() => {
    innerRef.current.scrollTop = innerRef.current.scrollHeight;
  }, []);

  const isSameOwner = (message, index, array) => {
    return message.owner === (array[index - 1] ? array[index - 1].owner : null);
  };

  const isSameDay = (message, index, array) => {
    if (array[index - 1]) {
      return isSameDayFunc(new Date(message.createdAt), new Date(array[index - 1].createdAt));
    }
    return false;
  };

  const isSameOwnerNext = (message, index, array) => {
    return message.owner === (array[index + 1] ? array[index + 1].owner : null);
  };

  return (
    <div ref={innerRef} className={clsx(globalClasses.p2, classes.messages)}>
      {conversation && selectors.getMessagesByConversation(conversation.id).map((message, index, array) =>
        <Message
          isSameOwnerNext={isSameOwnerNext(message, index, array)}
          isSameOwner={isSameOwner(message, index, array)}
          isSameDay={isSameDay(message, index, array)}
          getProfile={getProfile}
          key={index}
          conversation={conversation}
          message={message}
          keyRef={index}
          isLast={(array.length - 1) === index}/>,
      )}
    </div>
  );
};

export default ListMessage;


