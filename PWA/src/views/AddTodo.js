import {html, render} from 'lit-html';

export default class AddTodo {
    constructor(page) {
        this.page = page;
        this.properties = {
            todo: {}
        };

        this.renderView();
    }

    set todos(value) {
        this.properties.todos = value;
    }

    get todos() {
        return this.properties.todos;
    }

    template() {
        return html`
      <section class="h-full">
        <form @submit="${this.handleForm.bind(this)}" class="w-full p-10">
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                Titre todo
              </label>
            </div>
            <div class="md:w-2/3">
              <input 
                  @input="${e => this.properties.todo.title = e.target.value}"
                  class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                  id="title" 
                  type="text" 
                  placeholder="Ma todolist">
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-username">
                Description
              </label>
            </div>
            <div class="md:w-2/3">
              <textarea 
                @input="${e => this.properties.todo.description = e.target.value}"    
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="description"
                >    
              </textarea>
            </div>
          </div>
          <div class="md:flex md:items-center">
            <div class="md:w-1/3"></div>
            <div class="md:w-2/3">
              <button class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                Créer
              </button>
            </div>
          </div>
        </form>
      </section>
    `;
    }

    renderView() {
        const view = this.template();
        render(view, this.page);
    }

    handleForm(e) {
        e.preventDefault();
        if (Object.keys(this.properties.todo).length === 0) return console.error('[todo] Value is required !!!');
        const todo = {
            id: Date.now(),
            title: this.properties.todo.title,
            description: this.properties.todo.description.trim(),
            synced: 'true',
            updated: 'false',
            done: 'false',
            deleted: 'false',
            date: Date.now()
        };

        const event = new CustomEvent('create-todo', { detail: todo });
        document.dispatchEvent(event);

        // Clearing input
        this.properties.todo = {};
        const title = document.querySelector('#title');
        const description = document.querySelector('#description');
        title.value = '';
        description.value = '';

        this.renderView();
    }
}
