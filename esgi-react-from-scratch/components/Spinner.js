import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";

export default class Spinner extends Component {

    constructor(props, children) {
        super(props, children);
    }

    render() {
        return Zouav.createElement('div', { "class": 'spinner-overlay' }, [
            Zouav.createElement('div', { "class": 'spinner-container' }, [])
        ]);
    }

}
