import {useContext, useMemo} from "react";
import RootContext from "../context/RootContext";
import {login, signup, put} from "../context/actions/user.actions";

const useUser = () => {
        const {state: {user: userState}, dispatch} = useContext(RootContext);

        const actions = {
            login: function (user) {
                return new Promise((resolve, reject) => {
                    login(user)
                        .then(user => {
                            resolve(dispatch({
                                type: "LOGIN_SUCCESS",
                                payload: user,
                            }));
                        })
                        .catch(err => {
                            reject(dispatch({
                                type: "LOGIN_ERROR",
                                payload: err.username,
                            }));
                        });
                });

            },
            signup: function (user) {
                return new Promise((resolve, reject) => {
                    signup(user)
                        .then(user => resolve(user))
                        .catch(err => reject(err))
                })
            },
            logout: function () {
                dispatch({
                    type: 'LOGOUT'
                })
            },
            put: function (user) {
                return new Promise((resolve, reject) => {
                    put(user)
                        .then(() => resolve(dispatch({
                            type: "EDIT_USER",
                            payload: user,
                        })))
                        .catch(err => reject(err))
                })
            },
            setSelectedMerchant: function (merchant) {
                dispatch({
                    type: "ADD_SELECTED_MERCHANT",
                    payload: merchant
                })

            },
            removeSelectedMerchant: function () {
                dispatch({
                    type: "REMOVE_SELECTED_MERCHANT"
                })
            },
            rehydrate: function (user) {
                return new Promise(resolve => resolve(dispatch({
                    type: "REHYDRATE_USER",
                    payload: user
                })));
            }
        };

        const getIsMerchantUserApproved = useMemo(() => {
            let success = false;
            if (!userState.user) return false;
            if (userState.user.role === "ADMIN") {
                success = true;
            } else {
                if (!userState.user.merchants.length > 0) return false;
                success = !!userState.user.merchants[0].approved;
            }
            return success;
        }, [userState.user])

        const selectors = {
            getUser: () => userState.user,
            getIsMerchantUserApproved: () => getIsMerchantUserApproved,
            getError: () => userState.error,
            getSelectedMerchant: () => userState.selectedMerchant
        };

        return {selectors, actions};
    }
;

export default useUser;
