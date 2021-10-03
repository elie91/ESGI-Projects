import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  addMessage,
  deleteMessage,
  fetchMessages,
  fetchMessage,
  RECEIVE_MESSAGES,
  RECEIVE_DELETE_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_ADD_MESSAGES, RECEIVE_MERCURE_MESSAGES, updateMessage, RECEIVE_UPDATE_MESSAGES,
} from "../context/actions/message";

const useMessage = () => {
  const {
    state: { messages: messagesState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getMessages: async (params) => {

      if (messagesState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_MESSAGES });

      const messages = await fetchMessages(params);

      dispatch({
        type: RECEIVE_MESSAGES,
        payload: { messages },
      });

      return messages;
    },
    addMessage: async (values, user) => {
      return addMessage(values).then((message) => {
        dispatch({
          type: RECEIVE_ADD_MESSAGES,
          payload: { message, user },
        });
      });
    },
    updateMessage: async (values) => {
      return updateMessage(values).then((message) => {
        dispatch({
          type: RECEIVE_UPDATE_MESSAGES,
          payload: { message },
        });
      });
    },
    fetchMessage: async (id) => await fetchMessage(id),
    deleteMessage: async (id) => {
      return deleteMessage(id).then((message) => {
        dispatch({
          type: RECEIVE_DELETE_MESSAGES,
          payload: { message },
        });
      });
    },
    receiveMessage: (values) => {
      dispatch({
        type: RECEIVE_MERCURE_MESSAGES,
        payload: { message: values },
      });
    },
  };

  const selectors = {
    getMessages: () => {
      return messagesState.messages;
    },
    getMessagesByMessage: (id) => {
      const message = messagesState.messages.find(message => message.id === id);
      return message ? message.messages : [];
    },
    isLoading: () => {
      return messagesState.loading;
    },
    isEmpty: () => {
      return messagesState.messages.length === 0;
    },
    getMetadata: () => {
      return {};
    },
  };

  return { actions, selectors };
};

export default useMessage;
