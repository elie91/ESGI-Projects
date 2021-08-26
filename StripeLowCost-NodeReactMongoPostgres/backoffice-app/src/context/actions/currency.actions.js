import {GET_CURRENCY} from "../../config";
import {checkResponse} from "../../utils/utils";

export const fetchCurrencies = () => {
    return fetch(GET_CURRENCY)
        .then(response => checkResponse(response))
        .then(data => data)
}