import {
  RECEIVE_ADD_CONVERSATIONS,
  RECEIVE_DELETE_CONVERSATIONS,
  RECEIVE_CONVERSATIONS,
  REQUEST_CONVERSATIONS,
  RECEIVE_MERCURE_CONVERSATIONS,
  RECEIVE_MERCURE_CONVERSATION_MESSAGES,
  RECEIVE_MERCURE_DELETE_CONVERSATION_MESSAGES,
  SHOW_CONVERSATION,
  OPEN_CONVERSATIONS,
  RECEIVE_MERCURE_UPDATE_CONVERSATION_MESSAGES,
} from "../actions/conversation";
import { RECEIVE_ADD_MESSAGES, RECEIVE_DELETE_MESSAGES, RECEIVE_UPDATE_MESSAGES } from "../actions/message";

export const initialState = {
  conversations: [],
  loading: false,
  open: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_CONVERSATIONS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload.conversations,
        loading: false,
      };
    case RECEIVE_ADD_CONVERSATIONS:
      return {
        ...state,
        conversations: [...state.conversations, {
          ...action.payload.conversation,
          messages: [],
        }],
      };
    case RECEIVE_DELETE_CONVERSATIONS:
      return {
        ...state,
        conversations: state.conversations.filter(item => item.id !== action.payload.id),
      };
    case RECEIVE_MERCURE_CONVERSATIONS:
      return {
        ...state,
        conversations: [...state.conversations, {
          ...action.payload.conversation,
          hasNewMessage: true,
        }],
      };
    case RECEIVE_MERCURE_CONVERSATION_MESSAGES:
    case RECEIVE_ADD_MESSAGES:
      return {
        ...state,
        conversations: state.conversations.map(conversation => {
          if (conversation.id === action.payload.message.conversation_id) {
            return {
              ...conversation,
              hasNewMessage: action.payload.user.id !== action.payload.message.owner,
              messages: conversation.messages ? [...conversation.messages, action.payload.message] : [action.payload.message],
            };
          }
          return conversation;
        }),
      };
    case RECEIVE_MERCURE_UPDATE_CONVERSATION_MESSAGES:
    case RECEIVE_UPDATE_MESSAGES:
      return {
        ...state,
        conversations: state.conversations.map(conversation => {
          if (conversation.id === action.payload.message.conversation_id) {
            return {
              ...conversation,
              messages: conversation.messages.map(message => {
                if (message.id === action.payload.message.id) {
                  return action.payload.message;
                }
                return message;
              }),
            };
          }
          return conversation;
        }),
      };
    case RECEIVE_MERCURE_DELETE_CONVERSATION_MESSAGES:
    case RECEIVE_DELETE_MESSAGES:
      return {
        ...state,
        conversations: state.conversations.map(conversation => {
          if (conversation.id === action.payload.message.conversation) {
            return {
              ...conversation,
              messages: conversation.messages.filter(item => item.id !== action.payload.message.id),
            };
          }
          return conversation;
        }),
      };
    case SHOW_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map(conversation => {
          if (conversation.id === action.payload.conversation.id) {
            return {
              ...conversation,
              hasNewMessage: false,
            };
          }
          return conversation;
        }),
      };
    case OPEN_CONVERSATIONS:
      return {
        ...state,
        open: action.payload.open,
      };
    default:
      return state;
  }
};
