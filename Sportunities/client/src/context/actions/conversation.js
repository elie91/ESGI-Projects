import Request from "../../helpers/RequestHelper";
import { API_CONVERSATIONS } from "../../config/entrypoint";

export const REQUEST_CONVERSATIONS = "REQUEST_CONVERSATIONS";
export const RECEIVE_CONVERSATIONS = "RECEIVE_CONVERSATIONS";
export const RECEIVE_ADD_CONVERSATIONS = "RECEIVE_ADD_CONVERSATIONS";
export const RECEIVE_DELETE_CONVERSATIONS = "RECEIVE_DELETE_CONVERSATIONS";
export const RECEIVE_MERCURE_CONVERSATIONS = "RECEIVE_MERCURE_CONVERSATIONS";
export const RECEIVE_MERCURE_CONVERSATION_MESSAGES = "RECEIVE_MERCURE_CONVERSATION_MESSAGES";
export const RECEIVE_MERCURE_DELETE_CONVERSATION_MESSAGES = "RECEIVE_MERCURE_DELETE_CONVERSATION_MESSAGES";
export const RECEIVE_MERCURE_UPDATE_CONVERSATION_MESSAGES = "RECEIVE_MERCURE_UPDATE_CONVERSATION_MESSAGES";
export const SHOW_CONVERSATION = "SHOW_CONVERSATION";
export const OPEN_CONVERSATIONS = "OPEN_CONVERSATIONS";

export function fetchConversations (params) {
  return Request.request(API_CONVERSATIONS, {
    query: params,
  });
}

export const addConversation = (values) => Request.request(API_CONVERSATIONS, {
  method: "POST",
  body: values,
});

export function fetchConversation (id) {
  return Request.request(`${API_CONVERSATIONS}/${id}`);
}

export const deleteConversation = (id) => Request.request(`${API_CONVERSATIONS}/${id}`, {
  method: "DELETE",
});
