function init() {
    document.addEventListener('DOMContentLoaded', () => {
        refreshFromStorage()
        window.addEventListener('storage', e => { refreshFromStorage() })

        document.getElementById('message-input').addEventListener("keyup", e => {
            if (e.key === "Enter") {
                const messages = getMessages();

                const author = getAuthor(messages);

                const messageInput = document.getElementById("message-input");
                const text = messageInput.value;
                messageInput.value = "";
                const date = new Date();

                messages.push({
                    author,
                    text,
                    date,
                });

                localStorage.setItem('messages', JSON.stringify(messages));
                window.dispatchEvent(new Event('storage'));
            }
        });

        const menuButton = document.getElementById('menu-button');
        const menu = document.getElementById('menu');
        menuButton.addEventListener('click', e => {
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
                menuButton.innerText = 'x';
            } else {
                menu.style.display = 'none';
                menuButton.innerText = 'â˜°';
            }
        });

        document.getElementById('save-button').addEventListener('click', e => {
            let a = document.createElement('a');
            a.href = "data:application/octet-stream," + encodeURIComponent(localStorage.getItem('messages'));
            a.download = 'bossee-me.json';
            a.click();
        });

        document.getElementById('load-button').addEventListener('change', e => {
            var file = e.target.files[0];
            if (!file) {
                return;
            }

            var reader = new FileReader();

            reader.onload = function (e) {
                var contents = e.target.result;
                localStorage.setItem('messages', contents);
                window.dispatchEvent(new Event('storage'));
            };

            reader.readAsText(file);
        }, false);

        const infoButton = document.getElementById('info-button');
        const closeButton = document.getElementById('close-button');
        const description = document.getElementById('description');

        const toggleDescription = () => {
            description.classList.toggle('show');
        };

        infoButton.addEventListener('click', toggleDescription);
        closeButton.addEventListener('click', toggleDescription);
        document.addEventListener('click', (e) => {
            if (e.target !== infoButton && e.target !== closeButton && !description.contains(e.target) && description.classList.contains('show')) {
                toggleDescription();
            }
        });
    });
}

function refreshFromStorage() {
    const messages = getMessages();

    const children = [];

    for (const message of messages) {
        const p = document.createElement("p");
        const text = document.createTextNode("[" + (new Date(message.date)).toLocaleString() + "] " + message.author + ": " + message.text);
        p.appendChild(text);
        children.push(p);
    }

    const messages_div = document.getElementById("messages");
    messages_div.replaceChildren(...children);

    document.getElementById("author").textContent = getAuthor(messages);

    scrollToBottom();
}

function getMessages() {
    const json = localStorage.getItem('messages');

    if (!json) {
        return [{
            author: 'Welcome',
            text: 'Bossee.me is a productivity tool with which you roleplay daily chat conversations between yourself and your boss. As your boss, enquire about progress on your projects. As yourself, discuss what you\'ve done since yesterday and what you will do by the next conversation. Type a message below and press enter to get started!',
            date: new Date(),
        }];
    }

    return JSON.parse(json);
}

function getAuthor(messages) {
    if (messages.length % 2 == 0) {
        return "Boss";
    } else {
        return "Employee";
    }
}

function scrollToBottom() {
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
}

export default init;
