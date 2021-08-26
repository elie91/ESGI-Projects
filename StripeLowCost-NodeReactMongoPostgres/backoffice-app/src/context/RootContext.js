import React, { createContext, useReducer } from "react";

import {combineReducers} from "../utils/utils";
import {
    initialState as userInitialState,
    reducer as userReducer,
} from "./reducers/user.reducer";

import {
    initialState as transactionsInitialState,
    reducer as transactionsReducer,
} from "./reducers/transactions.reducer";

import {
    initialState as merchantsInitialState,
    reducer as merchantsReducer,
} from "./reducers/merchants.reducer";

const RootContext = createContext(null);

const reducers = combineReducers({
    user: userReducer,
    transactions: transactionsReducer,
    merchants: merchantsReducer
});

const initialState = {
    user: userInitialState,
    transactions: transactionsInitialState,
    merchants: merchantsInitialState
};

export const RootProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducers, initialState);

    return (
        <RootContext.Provider value={{ state, dispatch }}>
            {children}
        </RootContext.Provider>
    );
};

export default RootContext;