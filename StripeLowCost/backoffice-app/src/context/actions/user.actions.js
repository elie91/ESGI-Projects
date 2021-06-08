import {LOGIN_CHECK, GET_USERS} from "../../config";

export const login = async user => {
    try {
        const response = await fetch(LOGIN_CHECK, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        });
        if(!response.ok) {
            return Promise.reject(await response.json())
        }
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        return data
    } catch (e) {
        return Promise.reject(e)
    }
}

export const signup = async user => {
    try {
        const response = await fetch(GET_USERS, {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            },
        });
        if(!response.ok) {
           return Promise.reject(await response.json())
        }
        return await response.json();
    } catch (e) {
        return Promise.reject(e)
    }
}

export const put = async user => {
    try {
        const response = await fetch(GET_USERS + `/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "content-type": "application/json"
            }
        });
        if(!response.ok) {
            return Promise.reject(await response.json())
        }
        return await response.json();
    } catch (e) {
        return Promise.reject(e)
    }
}