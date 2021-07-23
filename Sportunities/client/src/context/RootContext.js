import React, { createContext, useMemo, useReducer } from "react";

import {
  reducer as sportReducer,
  initialState as sportIS,
} from "./reducers/sport";

import {
  reducer as userReducer,
  initialState as userIS,
} from "./reducers/user";

import {
  reducer as clubReducer,
  initialState as clubIS,
} from "./reducers/club";

import {
  reducer as playerVideosReducer,
  initialState as playerVideosIS,
} from "./reducers/playerVideos";

import {
  reducer as videosReducer,
  initialState as videosIS,
} from "./reducers/videos";

import {
  reducer as subscriptionsReducer,
  initialState as subscriptionsIS,
} from "./reducers/subscriptions";

import {
  reducer as tagsReducer,
  initialState as tagsIS,
} from "./reducers/tags";

import {
  reducer as experienceReducer,
  initialState as experienceIS,
} from "./reducers/experience";

import {
  reducer as positionReducer,
  initialState as positionIS,
} from "./reducers/position";

import {
  reducer as playerReducer,
  initialState as playerIS,
} from "./reducers/player";

import {
  reducer as agentReducer,
  initialState as agentIS,
} from "./reducers/agent";

import {
  reducer as conversationReducer,
  initialState as conversationIS,
} from "./reducers/conversation";

import {
  reducer as messageReducer,
  initialState as messageIS,
} from "./reducers/message";

import {
  reducer as navigationReducer,
  initialState as navigationIS,
} from "./reducers/navigation";

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
  sports: sportReducer,
  users: userReducer,
  clubs: clubReducer,
  playerVideos: playerVideosReducer,
  tags: tagsReducer,
  experiences: experienceReducer,
  positions: positionReducer,
  videos: videosReducer,
  subscriptions: subscriptionsReducer,
  players: playerReducer,
  agents: agentReducer,
  conversations: conversationReducer,
  messages: messageReducer,
  navigation: navigationReducer,
});

const rootInitialState = {
  sports: sportIS,
  users: userIS,
  clubs: clubIS,
  playerVideos: playerVideosIS,
  tags: tagsIS,
  experience: experienceIS,
  positions: positionIS,
  videos: videosIS,
  subscriptions: subscriptionsIS,
  players: playerIS,
  agents: agentIS,
  conversations: conversationIS,
  messages: messageIS,
  navigation: navigationIS,
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
