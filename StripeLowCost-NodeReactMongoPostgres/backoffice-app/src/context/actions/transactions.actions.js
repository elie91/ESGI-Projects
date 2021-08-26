import {checkResponse} from "../../utils/utils";
import {GET_MERCHANTS, GET_TRANSACTIONS} from "../../config";

export const fetchTransactions = (token) => {
    return fetch(GET_TRANSACTIONS, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => checkResponse(response))
        .then(transactions => transactions)
}

export const fetchTransactionById = (token, id) => {
    return fetch(`${GET_TRANSACTIONS}/${id}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => checkResponse(response))
        .then(data => data)
}

export const fetchTransactionsByMerchant = (id, token) => {
    return fetch(`${GET_MERCHANTS}/${id}/transactions`, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => checkResponse(response))
        .then(data => data)
}

export const searchTransactions = (searchText, token, merchant) => {
    return fetch(`${GET_TRANSACTIONS}/search?s=${searchText}&merchant=${merchant}`, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => response.json())
        .then(data => data)
}

export const groupTransactionsByDate = (user, merchant) => {
    let url = `${GET_TRANSACTIONS}/group-by-date`;
    if (merchant) {
        url = url + "?merchant=" + merchant.id
    }
    return fetch(url, {
        headers: {
            Authorization: "Bearer " + user.token
        }
    })
        .then(response => checkResponse(response))
        .then(data => data)
}

export const getAmountByDate = (token, merchant) => {
    let url = `${GET_TRANSACTIONS}/amount-per-date`;
    if (merchant) {
        url = url + "?merchant=" + merchant.id
    }
    return fetch(url, {
        headers: {
            Authorization: "Bearer " + token
        }
    })
        .then(response => checkResponse(response))
        .then(data => data)
}