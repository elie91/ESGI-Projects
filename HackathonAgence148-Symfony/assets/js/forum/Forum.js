class Forum {
    constructor() {
        this.comments_wrapper = Array.from(document.querySelectorAll('.comment_wrapper'));
        this.btn_add = Array.from(document.querySelectorAll('.add_comment'));
        if (!this.comments_wrapper) {
            return;
        }
        this.initEvents();
    }

    initEvents() {
        this.btn_add.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                const input = button.parentNode.parentNode.firstElementChild;
                const author = button.dataset.author;
                const topic = button.dataset.topic;
                const wrapper = document.getElementById(`comment_${button.dataset.topic}`);
                if (!input.value) return;
                fetch(`${window.location.origin}/admin/ajax/comment/add`, {
                    method: 'post',
                    body: JSON.stringify({
                        content: input.value,
                        author,
                        topic
                    })
                })
                    .then(response => {
                        if (response.status === 200) {
                            return response.json()
                        }
                    })
                    .then(data => {
                        input.value = "";

                        const comment = document.createElement('div');
                        const body = document.createElement('div');
                        const content = document.createElement('div');
                        const content_span = document.createElement('span');
                        const author = document.createElement('span');
                        const img = document.createElement('img');

                        comment.classList.add('comment');
                        body.classList.add('comment__body');
                        img.classList.add('comment__photo');
                        content.classList.add('comment__content');
                        author.classList.add('comment__author');

                        content_span.innerText = data.content;
                        author.innerText = `${data.author} - ${data.date}`;
                        img.src = `/build/images/users/Photo_mon-compte.png`;
                        //img.src = `/build/images/users/10.jpeg`;

                        content.appendChild(content_span);
                        content.appendChild(author);
                        body.appendChild(img);
                        body.appendChild(content);
                        comment.appendChild(body);
                        wrapper.appendChild(comment);

                    });

            });
        })
    }
}

export default Forum;