import {checkResponse} from "../../utils/utils";
import {GET_MERCHANTS} from "../../config";

export const fetchMerchants = (token) => {
    return fetch(GET_MERCHANTS, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => checkResponse(response))
        .then(data => data)
}

export const fetchMerchantById = (token, id) => {
    return fetch(`${GET_MERCHANTS}/${id}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => checkResponse(response))
        .then(data => data)
}

export const putMerchant = (token, data) => {
    return fetch(`${GET_MERCHANTS}/${data.id}`, {
        method: 'put',
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),

    })
        .then(response => checkResponse(response))
        .then(data => data)
        .catch(err => Promise.reject(err))
}

export const generateNewKeys = (token, id) => {
    return fetch(`${GET_MERCHANTS}/${id}/keys`, {
        method: 'PUT',
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => checkResponse(response))
        .then(data => data)
}