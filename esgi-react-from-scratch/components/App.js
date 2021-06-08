import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";
import User from "./User.js";
import Navbar from "../components/Navbar.js";
import Spinner from "../components/Spinner.js"

export default class App extends Component {

    constructor(props, children) {
        super(props, children);
        this.initState({
            'users': [],
            'selected_user': null
        });
    }

    handleForm = event => {
        event.preventDefault()
        this.setState({
            'selected_user': document.getElementById('select-user').value
        });
        document.getElementById('users_form').submit()
    }

    render() {
        if (this.getState('users').length === 0) {
            fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => response.json())
                .then(data => this.setState({ 'users': data }))
            return Zouav.createElement('div', {}, [
                Zouav.createElement(Navbar, {}, []),
                Zouav.createElement(Spinner, {}, [])
            ])
        } else {
            return Zouav.createElement('div', {}, [
                Zouav.createElement(Navbar, {}, []),
                Zouav.createElement('div', { 'class': 'container mt-5' }, [
                    Zouav.createElement('div', { 'class': 'd-flex justify-content-center' }, [
                        Zouav.createElement('div', { 'class': 'col-lg-6 col-md-6' }, [
                            Zouav.createElement('div', { 'class': 'card' }, [
                                Zouav.createElement(User, {
                                    'users': this.getState('users'),
                                    'selected_user': this.getState('selected_user'),
                                    'handleForm': this.handleForm
                                })
                            ]),
                        ])
                    ]),
                ])
            ]);
        }
    }

}
