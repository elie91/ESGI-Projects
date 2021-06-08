import page from 'page';
import checkConnectivity from './network.js';
import { createTodo, fetchTodos, fetchTodo } from './api/todos.js';
import { getTodos, setTodo, setTodos, getTodo, unsetTodo } from './idb.js';
import { createTodoEvent, updateTodoEvent, deleteTodoEvent } from './utils/todoEvent';
import displayCurrentPage from "./utils/displayCurrentPage";

const HomePage = await import('./views/Home.js');
const addTodoPage = await import('./views/AddTodo.js');
const detailTodoPage = await import('./views/DetailTodo.js');

checkConnectivity({});
document.addEventListener("connection-changed", e => {
    document.offline = !e.detail;
    if (!document.offline) {
        getTodos().then(values => {
            values.forEach(value => {
                if (value.synced === "false") {
                    createTodo(value).then(() => console.log("Added Todo to db"));
                    unsetTodo(value.id).then(() => console.log("Todo remove"));
                    value.synced = "true";
                    setTodo(value).then(() => console.log("Idb updated"));
                }
            })
        });
    }
});

const app = document.querySelector('#app');

fetch('/config.json')
    .then(result => result.json())
    .then(async (config) => {
        window.config = config;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/styles/tailwind.css';
        document.head.appendChild(link);

        page('/', async (ctx) => {
            const Home = HomePage.default;

            let todos = [];
            if (navigator.onLine) {
                const data = await fetchTodos();
                if (data !== false) {
                    todos = await setTodos(data);
                }
                todos = await getTodos();
            } else {
                todos = await getTodos();
            }
            const ctn = app.querySelector('[page="home"]');
            const HomeView = new Home(ctn);
            HomeView.todos = todos;
            displayCurrentPage('home');
            return HomeView.renderView();
        });

        page('/add-todo', async (ctx) => {
            const AddTodo = addTodoPage.default;

            const ctn = app.querySelector('[page="addTodo"]');
            new AddTodo(ctn);
            displayCurrentPage('addTodo');
            createTodoEvent();
        });

        page('/todos/:id', async (ctx) => {
            let todo = {};
            if (navigator.onLine) {
                todo = await fetchTodo(ctx.params.id);
            } else {
                todo = await getTodo(ctx.params.id);
            }
            const DetailTodo = detailTodoPage.default;
            const ctn = app.querySelector('[page="detail"]');
            const DetailTodoView = new DetailTodo(ctn);
            DetailTodoView.todo = todo;
            displayCurrentPage('detail');
            updateTodoEvent();
            deleteTodoEvent();
            return DetailTodoView.renderView();
        });

        // Start router
        page();

    });