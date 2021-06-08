import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";

export default class Button extends Component {

    constructor(props, children) {
        super(props, children);
    }


    render() {
        return Zouav.createElement('button', this.props, this.children);
    }

}
