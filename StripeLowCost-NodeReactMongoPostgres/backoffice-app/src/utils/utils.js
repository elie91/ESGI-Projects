export function combineReducers(reducerDict) {
    return function (state = {}, action) {
        return Object.keys(reducerDict).reduce((stateGlobal, curr) => {
            let slice = reducerDict[curr](state[curr], action);
            return {...stateGlobal, [curr]: slice};
        }, state);
    };
}

export function checkResponse(response) {
    if (!response.ok) {
        const res = response.json();
        return Promise.reject(res);
    } else {
        return response.json()
    }
}

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const decodeFile = (blob) => {
    const reader = new FileReader();
    return reader.readAsText(blob);
}

export const getFormatedDate = date => {
    const dateFormat = new Date(date);
    return dateFormat.toLocaleDateString();
}

export const getConstantStatus = status => {
    switch (status) {
        case "CREATED":
            return "Paiement démarré";
        case "PAID":
            return "Paiement réussi";
        case "FAIL":
            return "Echec du paiement";
        case "PROCESSING":
            return "Paiement en cours";
        case "REFUND":
            return "Remboursement du paiement";
        default:
            return ""
    }
}

export const getConstantIcon = status => {
    switch (status) {
        case "CREATED":
            return "fa-money-check";
        case "PAID":
            return "fa-check-circle";
        case "FAIL":
            return "fa-money-check";
        case "REFUND":
            return "fa-money-bill";
        case "PROCESSING":
            return "fa-money-bill"
        default:
            return ""
    }
}


export function urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
}
