export function type_check_v1(value, type) {
    if (typeof value === "object") {
        if (Array.isArray(value)) return type === "array";
        if (value === null) return type === "null";
    }
    return typeof value === type;
}

export function type_check_v2(object, conf) {
    for (let key in conf) {
        switch (key) {
            case "type":
                if (!type_check_v1(object, conf.type)){
                    return false;
                }
                break;
            case "properties":
                let error = false;
                Object.entries(object).forEach(function (value) {
                    if (!type_check_v1(value[1], conf.properties[value[0]].type ? conf.properties[value[0]].type : conf.properties[value[0]])){
                        error = true;
                    }
                    if (type_check_v1(value[1], "object")){
                        if (!type_check_v2(value[1], conf.properties[value[0]])){
                            error = true;
                        }
                    }
                });
                if (error) return false;
                break;
            case "enum":
                conf.enum.forEach(val => {
                    return type_check_v2(object, {properties: val});

                });
                break;
            default:
                break;
        }
    }
    return true;
}
