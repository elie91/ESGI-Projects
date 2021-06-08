import { type_check_v1, type_check_v2 } from "../libs/TypeCheck.js";
import Component from "./Component.js";


let currentProp = null;

function createElement(type, props, children) {

    //check if type is a component
    if (typeof type === 'function') {
        currentProp = props;
        return (new type(props, children));
    }

    let e = document.createElement(type);

    for (let [key, value] of Object.entries(props)) {
        if (key === 'event') {
            for (let [type, callback] of Object.entries(value)) {
                e.addEventListener(type, callback);
            }
        } else {
            e.setAttribute(key, value);
        }
    }

    if (type_check_v1(children, 'string')) {
        e.appendChild(document.createTextNode(children));
    }

    if (type_check_v1(children, 'array')) {
        children.forEach((child) => {
            if (child instanceof Component) {
                e.appendChild(child.display())
            } else {
                if (type_check_v1(child, 'array')) {
                    child.forEach(c => e.appendChild(c))
                } else {
                    e.appendChild(child)
                }
            }
        });
    }

    return e;
}

const Zouav = {
    createElement
};

export default Zouav;
