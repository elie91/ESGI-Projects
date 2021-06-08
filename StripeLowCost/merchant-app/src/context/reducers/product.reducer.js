import {addItemToCart, removeItemFromCart} from "../../utils/utils";

export const initialState = {
    products: [],
    cartItems: [],
    cartHidden: true,
    error: null,
    //testing purpose
    userCommands: []
};

/**
 * action = {type: String, payload: any}
 */
export const reducer = (state, action) => {
    switch (action.type) {

        case 'FETCH_PRODUCTS_SUCCESS':
            return {
                ...state,
                products: action.payload
            }

        case 'FETCH_PRODUCTS_ERROR':
            return {
                ...state,
                error: action.payload
            }

        case 'TOGGLE_CART_HIDDEN':
            return {
                ...state,
                cartHidden: !state.cartHidden
            };

        case 'ADD_ITEM_TO_CART':
            return {
                ...state,
                cartItems: addItemToCart(state.cartItems, action.payload)
            };

        case 'REMOVE_ITEM_TO_CART':
            return {
                ...state,
                cartItems: removeItemFromCart(state.cartItems, action.payload)
            };

        case 'CLEAR_ITEM_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(cartItem => cartItem.name !== action.payload.name)
            };

        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: []
            };

        case 'ADD_COMMAND':
            return {
                ...state,
                userCommands: [...state.userCommands, action.payload],
                cartItems: []
            };
        default:
            return state;
    }
};