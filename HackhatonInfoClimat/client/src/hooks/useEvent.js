import { RootContext } from "../context/RootContext";
import { useContext } from "react";
import {
  fetchEvents,
  fetchEvent,
  RECEIVE_EVENTS,
  REQUEST_EVENTS,
  OPEN_MODAL,
  CLOSE_MODAL, fetchEventsByHistoricValues,
} from "../context/actions/event";

const useEvent = () => {
  const {
    state: { events: eventsState },
    dispatch,
  } = useContext(RootContext);

  const actions = {
    getEvents: async (params) => {
      if (eventsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_EVENTS });

      const events = await fetchEvents(params);

      dispatch({
        type: RECEIVE_EVENTS,
        payload: {
          events: events.rows,
          filter: true,
          metadata: {
            count: events.count,
            location: params && params.localisation ? params.localisation : null,
            page: params && params.page ? params.page : 1,
          },
        },
      });

      return {
        events,
        page: params && params.page ? params.page : 1,
      };
    },
    getEventsHistoricValues: async (params) => {
      if (eventsState.loading) {
        return false;
      }

      dispatch({ type: REQUEST_EVENTS });

      const events = await fetchEventsByHistoricValues(params);

      dispatch({
        type: RECEIVE_EVENTS,
        payload: {
          events: events.rows,
          filter: true,
          metadata: {
            count: events.count,
            location: params && params.localisation ? params.localisation : null,
            page: params && params.page ? params.page : 1,
          },
        },
      });

      return {
        events,
        page: params && params.page ? params.page : 1,
      };
    },
    fetchEvent: async (id) => await fetchEvent(id),
    openModal: (event) => {
      dispatch({
        type: OPEN_MODAL,
        payload: event,
      });
    },
    closeModal: () => {
      dispatch({
        type: CLOSE_MODAL,
      });
    },
  };

  const selectors = {
    getEvents: () => {
      return eventsState.events;
    },
    isLoading: () => {
      return eventsState.loading;
    },
    getLength: () => {
      return eventsState.events.length;
    },
    isEmpty: () => {
      return eventsState.events.length === 0;
    },
    getMetadata: () => {
      return eventsState.metadata;
    },
    isModalOpen: () => {
      return eventsState.modal.open;
    },
    getModalEvent: () => {
      return eventsState.modal.event;
    },
  };

  return { actions, selectors };
};

export default useEvent;
