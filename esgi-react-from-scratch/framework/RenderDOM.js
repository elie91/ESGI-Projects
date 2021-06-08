import { type_check_v1 } from "../libs/TypeCheck.js";

export default class RenderDOM {

    constructor(component, container) {
        this.component = component;
        this.container = container;
        this.bind();
        this.render();
    }

    bind() {
        document.addEventListener('state_updated', () => this.render());
    }

    render() {
        while(this.container.firstChild)
        {
            this.container.removeChild(this.container.firstChild);
        }
        if (this.component.hasOwnProperty('content')) {
            this.container.appendChild(this.component.display());
        } else {
            this.container.appendChild(this.component)
        }
       
    }
}
