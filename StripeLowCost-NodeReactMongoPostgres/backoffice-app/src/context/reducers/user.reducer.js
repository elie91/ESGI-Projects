export const initialState = {
    user: null,
    error: null,
    selectedMerchant: null,
};

/**
 * action = {type: String, payload: any}
 */
export const reducer = (state, action) => {
    switch (action.type) {

        case 'LOGIN_SUCCESS':
        case 'REHYDRATE_USER':
        case 'EDIT_USER':
            return {
                ...state,
                user: action.payload
            }


        case 'LOGIN_ERROR':
        case 'EDIT_ERROR':
            return {
                ...state,
                error: action.payload
            }

        case 'LOGOUT':
            return {
                ...state,
                user: null
            }

        case 'ADD_SELECTED_MERCHANT':
            return {
                ...state,
                selectedMerchant: action.payload
            }

        case 'REMOVE_SELECTED_MERCHANT':
            return {
                ...state,
                selectedMerchant: null
            }

        default:
            return state;
    }
};
