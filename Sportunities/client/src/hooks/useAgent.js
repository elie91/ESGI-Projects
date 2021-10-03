import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  fetchAgents,
  fetchAgent,
  RECEIVE_AGENTS,
  REQUEST_AGENTS, updateAgent, RECEIVE_UPDATE_AGENTS, addAgent,
} from "../context/actions/agent";

const useAgent = () => {
  const {
    state: { agents: agentsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getAgents: async (params) => {

      if (agentsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_AGENTS });

      const agents = await fetchAgents(params);

      dispatch({
        type: RECEIVE_AGENTS,
        payload: {
          agents: agents.data,
          metadata: agents.metadata,
        },
      });

      return agents;
    },
    fetchAgent: async (id) => await fetchAgent(id),
    updateAgent: async (values) => {
      return updateAgent(values).then((agent) => {
        dispatch({
          type: RECEIVE_UPDATE_AGENTS,
          payload: {
            agent,
          },
        });
        return agent;
      });
    },
    addAgent: async (values) => await addAgent(values),
  };

  const selectors = {
    getAgents: () => {
      return agentsState.agents;
    },
    isLoading: () => {
      return agentsState.loading;
    },
    isEmpty: () => {
      return agentsState.agents.length === 0;
    },
    getMetadata: () => {
      return agentsState.metadata;
    },
  };

  return { actions, selectors };
};

export default useAgent;
