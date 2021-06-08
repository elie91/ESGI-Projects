import RenderDOM from "./framework/RenderDOM.js";
import Zouav from './framework/Zouav.js';
import App from './components/App.js';
import Todolist from './components/Todolist.js';
import Api from './components/Api.js';

document.addEventListener('DOMContentLoaded', onRouteChanged)
window.addEventListener("hashchange", onRouteChanged);

function onRouteChanged() {
    const hash = window.location.hash;

    switch (hash) {
        case "#/todolist":
            return new RenderDOM(
                Zouav.createElement(Todolist, {}, {}),
                document.getElementById('root')
            ).render();

        case "#/api":
            return new RenderDOM(
                Zouav.createElement(Api, {}, {}),
                document.getElementById('root')
            ).render();

        case '#/homepage':
            return new RenderDOM(
                Zouav.createElement(App, {}, {}),
                document.getElementById('root')
            ).render()
        
        default:
            return new RenderDOM(
                Zouav.createElement('h1', {}, "La page n'existe pas"),
                document.getElementById('root')
            ).render()
    }
}



// let conf = {
//     type: "object",
//     properties: {
//         prop1: {type: "number"},
//         prop2: {type: "string", enum:["val1", "val2"]},
//         prop3: {type:"object", properties: { prop31: 'number'}},
//         prop4: {type: "array", properties: ["boolean"]}
//     }
// };

// let object = {
//     prop1: 10,
//     prop2: "val1",
//     prop3: {
//         prop31: 10
//     },
//     prop4: [true]
// };

// console.log(type_check_v2(object, conf));
