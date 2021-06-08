import {getTodos, setTodo, unsetTodo} from "../idb";
import {createTodo, deleteTodo, updateTodo} from "../api/todos";
import page from 'page';

export function createTodoEvent() {
    document.addEventListener('create-todo', async ({detail: todo}) => {
        todo.synced = 'false';
        await setTodo(todo);
        page('/')
        if (!document.offline && navigator.onLine === true) {
            // If connection is good enought, do thte HTTP call
            todo.synced = 'true';
            const result = await createTodo(todo);
            if (result !== false) {
                page('/')
            }
            page('/')
        }
    });
}

export function updateTodoEvent() {
    document.addEventListener('update-todo', async ({detail: todo}) => {
        await setTodo(todo);
        if (!document.offline && navigator.onLine === true) {
            // If connection is good enought, do thte HTTP call
            const result = await updateTodo(todo);
            if (result !== false) {
                page(`/todos/${todo.id}`)
            }
            page(`/todos/${todo.id}`)
        }
    });
}

export function deleteTodoEvent() {
    document.addEventListener('delete-todo', async ({detail: todo}) => {
        await unsetTodo(todo.id);
        page('/')
        if (!document.offline && navigator.onLine === true) {
            await deleteTodo(todo.id);
            page('/')
        }
    });
}
