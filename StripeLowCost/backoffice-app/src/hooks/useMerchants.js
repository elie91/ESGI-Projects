import {useContext} from "react";
import RootContext from "../context/RootContext";
import {fetchMerchants, putMerchant} from "../context/actions/merchants.actions";

const useMerchants = () => {
    const {state: {merchants: merchantsState}, dispatch} = useContext(RootContext);

    const actions = {
        fetchMerchants: function (token) {
            return new Promise((resolve, reject) => {
                fetchMerchants(token)
                    .then((merchants) => {
                        resolve(dispatch({
                            type: "FETCH_MERCHANTS_SUCCESS",
                            payload: merchants,
                        }));
                    })
                    .catch(err => {
                        reject(dispatch({
                            type: "FETCH_MERCHANTS_ERROR",
                            payload: err,
                        }));
                    })
            });
        },
        updateMerchant: function (token, merchant) {
            return new Promise(resolve => {
                putMerchant(token, merchant)
                    .then(() => {
                        resolve(dispatch({
                            type: "PUT_MERCHANTS_SUCCESS",
                            payload: merchant,
                        }))
                    })

            })
        }
    };

    const selectors = {
        getMerchants: () => merchantsState.merchants,
        getMerchantsCount: () => merchantsState.merchants.length
    };

    return {selectors, actions};
};

export default useMerchants;