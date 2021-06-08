import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";

export default class Loader extends Component {

    constructor(props, children) {
        super(props, children);
    }

    render() {
        return Zouav.createElement('div', this.props, [
            Zouav.createElement('div', {'class': 'sk-chase-dot'}, []),
            Zouav.createElement('div', {'class': 'sk-chase-dot'}, []),
            Zouav.createElement('div', {'class': 'sk-chase-dot'}, []),
            Zouav.createElement('div', {'class': 'sk-chase-dot'}, []),
            Zouav.createElement('div', {'class': 'sk-chase-dot'}, []),
            Zouav.createElement('div', {'class': 'sk-chase-dot'}, []),
        ]);
    }

}
