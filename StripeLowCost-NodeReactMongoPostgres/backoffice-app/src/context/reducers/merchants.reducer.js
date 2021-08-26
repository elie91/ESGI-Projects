export const initialState = {
    merchants: []
};

/**
 * action = {type: String, payload: any}
 */
export const reducer = (state, action) => {
    switch (action.type) {

        case 'FETCH_MERCHANTS_SUCCESS':
            return {
                ...state,
                merchants: action.payload
            }
        case 'FETCH_MERCHANTS_ERROR':
            return {
                ...state,
                error: action.payload
            }

        case 'PUT_MERCHANTS_SUCCESS':
            return {
                ...state,
                merchants: state.merchants.map(merchant => {
                    if (action.payload.id === merchant.id) {
                        merchant = {...action.payload, transaction: merchant.transaction}
                    }
                    return merchant
                })
            }
        default:
            return state;
    }
};