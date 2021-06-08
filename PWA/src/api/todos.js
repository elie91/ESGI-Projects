export async function fetchTodos() {
    const config = window.config;
    return fetch(`${config.api}/todos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(result => result.json())
        .catch(error => {
            console.error(error);
            return false;
        });
}

export function fetchTodo(id) {
    const config = window.config;

    return fetch(`${config.api}/todos/${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(result => result.json())
        .catch(error => {
            console.error(error);
            return false;
        })
}

export function updateTodo(todo) {
    const config = window.config;

    return fetch(`${config.api}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
        .then(result => result.json())
        .catch(error => {
            console.error(error);
            return false;
        })
}

export function createTodo(data) {
    const config = window.config;
    return fetch(`${config.api}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .catch(error => {
            console.error(error);
            return false;
        });
}

export async function deleteTodo(id) {
    const config = window.config;
    return fetch(`${config.api}/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((result) => {
            result.json();
            window.location.reload(true)
        })
        .catch(error => {
            console.error(error);
            return false;
        });
}