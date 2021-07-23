import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  addExperience,
  deleteExperience,
  fetchExperiences,
  fetchExperience,
  updateExperience,
  RECEIVE_EXPERIENCES,
  REQUEST_EXPERIENCES,
} from "../context/actions/experience";

const useExperience = () => {
  const {
    state: { experiences: experiencesState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getExperiences: async (params) => {

      if (experiencesState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_EXPERIENCES });

      const experiences = await fetchExperiences(params);

      dispatch({
        type: RECEIVE_EXPERIENCES,
        payload: { experiences },
      });

      return experiences;
    },
    addExperience: async (values) => await addExperience(values),
    fetchExperience: async (id) => await fetchExperience(id),
    updateExperience: async (values) => await updateExperience(values),
    deleteExperience: async (id) => await deleteExperience(id),
  };

  const selectors = {
    getExperiences: () => {
      return experiencesState.experiences;
    },
    isLoading: () => {
      return experiencesState.loading;
    },
    isEmpty: () => {
      return experiencesState.experiences.length === 0;
    },
    getMetadata: () => {
      return {};
    },
  };

  return { actions, selectors };
};

export default useExperience;
