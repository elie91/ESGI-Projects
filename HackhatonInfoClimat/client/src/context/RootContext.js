import React, { createContext, useMemo, useReducer } from "react";

import {
  reducer as mapReducer,
  initialState as mapIS,
} from "./reducers/map";

import {
  reducer as eventReducer,
  initialState as eventIS,
} from "./reducers/event";

import {
  reducer as stationReducer,
  initialState as stationIS,
} from "./reducers/station";

export const RootContext = createContext(null);

function combineReducers (reducerDict) {
  return function (state = {}, action) {
    return Object.keys(reducerDict).reduce((acc, curr) => {
      let slice = reducerDict[curr](state[curr], action);
      return { ...acc, [curr]: slice };
    }, state);
  };
}

const rootReducer = combineReducers({
  map: mapReducer,
  events: eventReducer,
  stations: stationReducer,
});

const rootInitialState = {
  map: mapIS,
  events: eventIS,
  stations: stationIS,
};

export const RootProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, rootInitialState);

  return useMemo(
    () => (
      <RootContext.Provider value={{ state, dispatch }}>
        {children}
      </RootContext.Provider>
    ),
    [children, state],
  );
};
