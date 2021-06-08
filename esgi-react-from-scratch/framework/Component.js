class Component {

    oldProps = null;
    content = null;
    oldState = null;

    constructor(props, children) {
        this.props = props;
        this.children = children;
    }

    initState(state) {
        for (const [key, value] of Object.entries(state)) {
            //Si la key n'existe pas déja dans le local storage, on l'ajoute
            if (!sessionStorage.getItem(key) || sessionStorage.getItem(key) === "undefined") {
                sessionStorage.setItem(key, JSON.stringify(value));
            }
        }
    }

    getState(key) {
        const value = sessionStorage.getItem(key);
        return JSON.parse(value)
    }

    setState(partialState) {
        for (const [key, value] of Object.entries(partialState)) {
            //Si la clé existe dans le local storage, on la modifie
            if (sessionStorage.getItem(key)) {
                sessionStorage.setItem(key, JSON.stringify(value));
            }
        }
        const event = new Event('state_updated');
        document.dispatchEvent(event);
    }


    display() {

        //stoker le retour de render et le return si shouldupdate faux
        if (this.shouldUpdate()) {
            this.content = this.render();
        }
        return this.content;
    }


    shouldUpdate() {
        // if (this.props !== this.oldProps) {
        //     this.oldProps = this.props;
        //     return true;
        // } else {
        //     return false;
        // }
        return true;
    }

    render() {
        throw "Must implement render function";
    }

}

export default Component;
