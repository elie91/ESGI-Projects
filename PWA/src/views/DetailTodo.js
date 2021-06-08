import {html, render} from 'lit-html';
import 'lit-icon';

export default class DetailTodo {
    constructor(page) {
        this.page = page;
        this.properties = {
            todo: {}
        };
        this.renderView();
    }

    set todo(value) {
        this.properties.todo = value;
    }

    get todo() {
        return this.properties.todo;
    }

    deleteItem() {
        const event = new CustomEvent('delete-todo', { detail: this.todo });
        document.dispatchEvent(event);
    }

    updateItem() {
        this.todo.done = this.todo.done === 'true'  ? 'false' : 'true';
        const event = new CustomEvent('update-todo', { detail: this.todo });
        document.dispatchEvent(event);
    }

    template() {
        return html`
          <style>
            input:checked + svg {
              display: block;
            }
          </style> 
          <section class="toto-card mt-4 px-4 py-3 bg-gray-300 rounded-lg flex items-center shadow-sm">
            <aside>
              <label class="flex justify-start items-start" tabindex="0" aria-label="Check todo">
                <div class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center focus:border-blue-500">
                  <input type="checkbox" name="todo[]" class="opacity-0 absolute" tabindex="0"  ?checked="${this.properties.todo.done === 'true'}" @change=${this.updateItem.bind(this)}>
                  <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                </div>
              </label>
            </aside>
            <main class="flex-1 ml-2 truncate">
              <a class="block font-bold text-gray-900 truncate" href="${`/todos/${this.properties.todo.id}`}">${this.properties.todo.title}</a>
              <p>${this.properties.todo.description}</p>
            </main>
            ${this.todo.synced === 'false' ? html`<lit-icon icon="cloud-off"></lit-icon>` : '' }
            <button @click="${this.deleteItem.bind(this)}" class="ml-2 text-red-600" aria-label="Delete">
                <lit-icon icon="delete"></lit-icon>
            </button>
          </section>
          <lit-iconset>
            <svg><defs>
              <g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
            </defs></svg>
          </lit-iconset>
        `;
    }

    renderView() {
        const view = this.template();
        render(view, this.page);
    }
}
