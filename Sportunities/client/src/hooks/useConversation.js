import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  addConversation,
  deleteConversation,
  fetchConversations,
  fetchConversation,
  RECEIVE_CONVERSATIONS,
  RECEIVE_DELETE_CONVERSATIONS,
  REQUEST_CONVERSATIONS,
  RECEIVE_ADD_CONVERSATIONS,
  RECEIVE_MERCURE_CONVERSATIONS,
  RECEIVE_MERCURE_CONVERSATION_MESSAGES,
  RECEIVE_MERCURE_DELETE_CONVERSATION_MESSAGES,
  SHOW_CONVERSATION,
  OPEN_CONVERSATIONS,
  RECEIVE_MERCURE_UPDATE_CONVERSATION_MESSAGES,
} from "../context/actions/conversation";

const useConversation = () => {
  const {
    state: { conversations: conversationsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getConversations: async (params) => {

      if (conversationsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_CONVERSATIONS });

      const conversations = await fetchConversations(params);

      dispatch({
        type: RECEIVE_CONVERSATIONS,
        payload: { conversations },
      });

      return conversations;
    },
    addConversation: async (values) => {
      return addConversation(values).then((conversation) => {
        dispatch({
          type: RECEIVE_ADD_CONVERSATIONS,
          payload: { conversation },
        });
      });
    },
    fetchConversation: async (id) => await fetchConversation(id),
    deleteConversation: async (id) => {
      return deleteConversation(id).then(() => {
        dispatch({
          type: RECEIVE_DELETE_CONVERSATIONS,
          payload: { id: id },
        });
      });
    },
    receiveConversation: (values) => {
      dispatch({
        type: RECEIVE_MERCURE_CONVERSATIONS,
        payload: { conversation: values },
      });
    },
    receiveConversationMessage: (values, user) => {
      dispatch({
        type: RECEIVE_MERCURE_CONVERSATION_MESSAGES,
        payload: {
          message: values,
          user: user,
        },
      });
    },
    updateConversationMessage: (values) => {
      dispatch({
        type: RECEIVE_MERCURE_UPDATE_CONVERSATION_MESSAGES,
        payload: { message: values },
      });
    },
    deleteConversationMessage: (values) => {
      dispatch({
        type: RECEIVE_MERCURE_DELETE_CONVERSATION_MESSAGES,
        payload: { message: values },
      });
    },
    showConversation: (conversation) => {
      dispatch({
        type: SHOW_CONVERSATION,
        payload: { conversation },
      });
    },
    openConversations: (open) => {
      dispatch({
        type: OPEN_CONVERSATIONS,
        payload: { open },
      });
    },
  };

  const selectors = {
    getConversations: () => {
      return conversationsState.conversations;
    },
    getMessagesByConversation: (id) => {
      const conversation = conversationsState.conversations.find(conversation => conversation.id === id);
      return conversation ? (conversation.messages ? conversation.messages : []) : [];
    },
    isLoading: () => {
      return conversationsState.loading;
    },
    isEmpty: () => {
      return conversationsState.conversations.length === 0;
    },

    open: () => {
      return conversationsState.open;
    },
    getMetadata: () => {
      return {};
    },
  };

  return { actions, selectors };
};

export default useConversation;
