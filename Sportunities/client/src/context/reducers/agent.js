import {
  RECEIVE_AGENTS, RECEIVE_UPDATE_AGENTS,
  REQUEST_AGENTS,
} from "../actions/agent";

export const initialState = {
  agents: [],
  loading: false,
  metadata: {
    count: 0,
    page: 1
  },
};


export const reducer = (state, action) => {
  switch (action.type) {
    case REQUEST_AGENTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_AGENTS:
      return {
        ...state,
        agents: action.payload.metadata.page > 1 ? [...state.agents, ...action.payload.agents] : action.payload.agents,
        metadata: {
          ...state.metadata,
          ...action.payload.metadata,
        },
        loading: false,
      };
    case RECEIVE_UPDATE_AGENTS:
      return {
        ...state,
        agents: state.agents.map(item => {
          if (item.id === action.payload.agent.id) {
            return action.payload.agent;
          }
          return item;
        }),
      };
    default:
      return state;
  }
};
