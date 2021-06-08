import Component from "../framework/Component.js";
import Zouav from "../framework/Zouav.js";
import Navbar from "../components/Navbar.js";
import UsersTodo from '../data/UsersTodo.js';

export default class Todolist extends Component {

    constructor(props, children) {
        super(props, children);
        this.initState({
            UsersTodo
        });
    }

    toggle_todos = event => {
        //si on a cliqué sur l'icon et non sur le button
        let id = '';
        if (event.target.classList.contains('fa')) {
            id = event.target.closest('button').dataset.id
        } else {
            id = event.target.dataset.id;
        }
        const modified_todolist = this.getState('UsersTodo').map(todo => {
            if (todo.id == id) {
                todo.completed = !todo.completed
            }
            return todo
        });
        this.setState({
            'UsersTodo': modified_todolist
        });
        
    };

    render() {
        const current_user_todos = this.getState('UsersTodo').filter(todo => todo.userId == this.getState('selected_user'));
        if (current_user_todos.length === 0) {
            return Zouav.createElement('h1', { "class": "text-danger text-center" }, 'Aucune todo pour cette utilisateur')
        }
        const completed = current_user_todos.filter(todo => todo.completed === true)
        const not_completed = current_user_todos.filter(todo => todo.completed === false)

        const completed_todos = completed.map(todo => {
            return Zouav.createElement('tr', {}, [
                Zouav.createElement('th', { 'scope': 'row' }, todo.id.toString()),
                Zouav.createElement('td', {}, todo.title),
                Zouav.createElement('td', {}, [
                    Zouav.createElement('i', { 'class': todo.completed ? 'fa fa-check' : 'fa fa-times' })
                ]),
                Zouav.createElement('td', {}, [
                    Zouav.createElement('button', {
                        'class': todo.completed ? 'btn btn-danger' : 'btn btn-success',
                        'data-id': todo.id,
                        'event': { 'click': this.toggle_todos }
                    }, [
                        Zouav.createElement('i', { 'class': todo.completed ? 'fa fa-times' : 'fa fa-check' })
                    ])
                ])
            ])
        });

        const not_completed_todos = not_completed.map(todo => {
            return Zouav.createElement('tr', {}, [
                Zouav.createElement('th', { 'scope': 'row' }, todo.id.toString()),
                Zouav.createElement('td', {}, todo.title),
                Zouav.createElement('td', {}, [
                    Zouav.createElement('i', { 'class': todo.completed ? 'fa fa-check' : 'fa fa-times' })
                ]),
                Zouav.createElement('td', {}, [
                    Zouav.createElement('button', {
                        'class': todo.completed ? 'btn btn-danger' : 'btn btn-success',
                        'data-id': todo.id,
                        'event': { 'click': this.toggle_todos }
                    }, [
                        Zouav.createElement('i', { 'class': todo.completed ? 'fa fa-times' : 'fa fa-check' })
                    ])
                ])
            ])
        });

        return Zouav.createElement('div', {}, [
            Zouav.createElement(Navbar, {}, []),
            Zouav.createElement('div', {'class': 'container mt-3'}, [
                Zouav.createElement('h1', { 'class': 'text-primary mt mb text-center' }, `Todolist de l'utilisateur ${this.getState('selected_user')}`),
                Zouav.createElement('div', { 'class': 'row mt-5' }, [
                    Zouav.createElement('div', { 'class': 'col-lg-6 col-md-6' }, [
                        Zouav.createElement('h3', { "class": "text-danger" }, 'A faire'),
                        Zouav.createElement('table', { 'class': 'table' }, [
                            Zouav.createElement('thead', {}, [
                                Zouav.createElement('tr', {}, [
                                    Zouav.createElement('th', { 'scope': 'col' }, 'ID'),
                                    Zouav.createElement('th', { 'scope': 'col' }, 'Title'),
                                    Zouav.createElement('th', { 'scope': 'col' }, 'Status'),
                                    Zouav.createElement('th', { 'scope': 'col' }, 'Actions')
                                ])
                            ]),
                            Zouav.createElement('tbody', {}, [
                                not_completed_todos
                            ])
                        ])
                    ]),
                    Zouav.createElement('div', { 'class': 'col-lg-6 col-md-6' }, [
                        Zouav.createElement('h3', { "class": "text-success" }, 'Terminé'),
                        Zouav.createElement('table', { 'class': 'table' }, [
                            Zouav.createElement('thead', {}, [
                                Zouav.createElement('tr', {}, [
                                    Zouav.createElement('th', { 'scope': 'col' }, 'ID'),
                                    Zouav.createElement('th', { 'scope': 'col' }, 'Title'),
                                    Zouav.createElement('th', { 'scope': 'col' }, 'Status'),
                                    Zouav.createElement('th', { 'scope': 'col' }, 'Actions')
                                ])
                            ]),
                            Zouav.createElement('tbody', {}, [
                                completed_todos
                            ])
                        ])
                    ])
                ])
            ]),
        ])
    }

}
