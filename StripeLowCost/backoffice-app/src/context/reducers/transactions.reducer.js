export const initialState = {
    transactions: [],
    error: null
};

/**
 * action = {type: String, payload: any}
 */
export const reducer = (state, action) => {
    switch (action.type) {

        case 'FETCH_TRANSACTIONS_SUCCESS':
            return {
                ...state,
                transactions: action.payload
            }
        case 'FETCH_TRANSACTIONS_ERROR':
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
};