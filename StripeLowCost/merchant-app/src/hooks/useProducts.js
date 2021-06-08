import { useContext } from "react";
import RootContext from "../context/RootContext";
import { fetchProducts } from "../context/actions/product.actions";

const useProducts = () => {
    const {
        state: { products: productsState },
        dispatch,
    } = useContext(RootContext);

    const actions = {
        fetchProducts: function () {
            fetchProducts()
                .then((data) => {
                    dispatch({
                        type: "FETCH_PRODUCTS_SUCCESS",
                        payload: data,
                    });
                })
                .catch(err => {
                    dispatch({
                        type: "FETCH_PRODUCTS_ERROR",
                        payload: err,
                    });
                });
        },
        toggleCartHidden: function () {
            dispatch({
                type: "TOGGLE_CART_HIDDEN"
            })
        },
        addItemToCart: function (item) {
            dispatch({
                type: "ADD_ITEM_TO_CART",
                payload: item
            })
        },
        removeItemFromCart: function (item) {
            dispatch({
                type: 'REMOVE_ITEM_TO_CART',
                payload: item
            })
        },
        clearItemFromCart: function (item) {
            dispatch({
                type: 'CLEAR_ITEM_FROM_CART',
                payload: item
            })
        },
        clearCart: function () {
            dispatch({
                type: 'CLEAR_CART'
            })
        },
        addCommand: function (command) {
            dispatch({
                type: "ADD_COMMAND",
                payload: command
            })
        },
    };

    const selectors = {
        getProducts: () => productsState.products,
        getCartItems: () => productsState.cartItems,
        getCartTotal: () => productsState.cartItems.reduce((accumalatedQuantity, cartItem) => {
            return accumalatedQuantity + cartItem.quantity * cartItem.price
        }, 0),
        getCartHidden: () => productsState.cartHidden,
        getError: () => productsState.error,
        //testing purpose
        getUserCommands: () => productsState.userCommands
    };

    return { selectors, actions };
};

export default useProducts;
