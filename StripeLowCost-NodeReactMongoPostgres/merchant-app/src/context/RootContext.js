import React, { createContext, useReducer } from "react";

import {combineReducers} from "../utils/utils";
import {
    initialState as productsInitialState,
    reducer as productsReducer,
} from "./reducers/product.reducer";

const RootContext = createContext(null);

const reducers = combineReducers({
    products: productsReducer,
});

const initialState = {
    products: productsInitialState,
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