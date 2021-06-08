import { LitElement, html } from 'lit-element';
import page from 'page';

class TodoCard  extends LitElement {
    createRenderRoot() {
        return this;
    }

    static get properties() {
        return {
            todo: Object
        };
    }

    constructor() {
        super();
        this.todo = {};
    }

    render() {
        return html`
      <section class="toto-card mt-4 px-4 py-3 bg-gray-300 rounded-lg flex items-center shadow-sm">
        <main class="flex-1 ml-2 truncate">
          <a class="block font-bold text-gray-900 truncate" href="${`/todos/${this.todo.id}`}">${this.todo.title}</a>
        </main>
      </section>
    `;
    }
}

customElements.define('todo-card', TodoCard);