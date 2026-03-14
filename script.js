const list = document.getElementById("list");
const container = document.getElementById("list-container");
const newBtn = document.getElementById("newBtn");

const popup = document.getElementById("popup");
const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");

//JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g

async function uploadTask(text, completed) {
    const response = await fetch('https://tinkr.tech/sdb/todoList/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g'
        },
        body: JSON.stringify({ text, completed })
    });
    return await response.json();
};

async function deleteTask(id) {
    await fetch(`https://tinkr.tech/sdb/todoList/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g'
        }
    });
};

async function onPageLoad() {
    const tasks = await getTasks();
    for (const task of tasks) {
        addTask(task.text, task.completed, task.id);
    };
}

async function getTasks() {
    const response = await fetch('https://tinkr.tech/sdb/todoList/tasks', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g'
        }
    });
    return await response.json();
}
onPageLoad();

async function updateTask(text, completed, id) {
    await fetch(`https://tinkr.tech/sdb/todoList/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g'
        },
        body: JSON.stringify({"text": text, "completed": completed})
    });
}

function addTask(text, completed, id) {
    const task = document.createElement("li");
    task.textContent = text;

    if (completed === true) {
        task.classList.toggle('completed');
    }
    task.addEventListener('click', () => {
        task.classList.toggle('completed');
        updateTask(text, task.classList.contains('completed'), id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "deleteBtn";
    task.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', ()=> {
        deleteTask(id);
        task.remove();
    });

    list.appendChild(task);
};

newBtn.addEventListener("click", ()=> {
    popup.classList.toggle("show");

    if (popup.classList.contains("show")) {
        input.focus();
    }
});

document.addEventListener("click", (event) => {
    if (popup.classList.contains("show") && event.target !== newBtn && event.target !== input && event.target !== addBtn && event.target !== popup) {
        popup.classList.toggle("show");
    }
});

addBtn.addEventListener("click", async ()=> {
    await uploadTask(input.value, false);
    let tasks = await getTasks();
    for (const task of tasks) {
        if (task.text === input.value) {
            addTask(task.text, task.completed, task.id);
        }
    }
    input.value = "";
    popup.classList.toggle("show");
});

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addBtn.click();
    }
});


