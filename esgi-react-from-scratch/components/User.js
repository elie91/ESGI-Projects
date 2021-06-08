import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";
import Button from "../components/Button.js"


export default class User extends Component {

    constructor(props, children) {
        super(props, children);
    }

    render() {
        let options = [];
        if (this.props.users.length > 0) {
            options = this.props.users.map(user => {
                return Zouav.createElement('option', { 'value': user.id }, user.name)
            })
        }
        return Zouav.createElement('div', {'class':'card-body'}, [
            Zouav.createElement('h3', { 'class': 'text-primary mb-3' }, 'Choisir un utilisateur'),
            Zouav.createElement('form', {
                'method': 'post',
                'id': 'users_form',
                'action': '#/todolist',
                'event': { 'submit': this.props.handleForm }
            }, [
                Zouav.createElement('select', { 'class': 'form-control', 'name': 'selected-user', 'id': 'select-user' }, [
                    options
                ]),
                Zouav.createElement(Button, { 'class': 'btn btn-primary mt-3 ', 'type': 'submit' }, 'Valider'),
            ])
        ])
    }
}
