import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";

export default class Navbar extends Component {

    constructor(props, children) {
        super(props, children);
    }

    render() {
        return Zouav.createElement('nav', {'class': 'navbar navbar-light navbar-expand-lg bg-light'}, [
            Zouav.createElement('a', {'class': 'navbar-brand'}, "React Low Cost"),
            Zouav.createElement('ul', {'class': 'navbar-nav ml-auto'}, [
                Zouav.createElement('li', {'class': 'nav-item'}, [
                    Zouav.createElement('a', {'class': 'nav-link', 'href' : '#/homepage'}, 'Utilisateurs')
                ]),
                Zouav.createElement('li', {'class': 'nav-item'}, [
                    Zouav.createElement('a', {'class': 'nav-link', 'href' : '#/todolist'}, 'Todolist')
                ]),
                Zouav.createElement('li', {'class': 'nav-item'}, [
                    Zouav.createElement('a', {'class': 'nav-link', 'href' : '#/api'}, 'Star Wars')
                ])
            ]),
        ]);
    }
}
