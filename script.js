const list = document.getElementById("list");
const container = document.getElementById("list-container");
const newBtn = document.getElementById("newBtn");

const popup = document.getElementById("popup");
const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");

//user code
//t7pJ0_sFMA55OP2m-mYXfBHD8z5bYjsK9fxJyJh3FpM
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const signupBtn = document.getElementById("signupBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
let globalUsername = "";

//localStorage.setItem("currentUser", "");

if (localStorage.getItem("currentUser") !== "") {
    globalUsername = localStorage.getItem("currentUser");
    document.getElementById("userLogin").classList.toggle("hide");
    container.classList.toggle("show");
    loadTasks();
}

let timer = setTimeout(logout, 600000); // 10min
function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(logoutUser, 600000); // 10min
}
window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeydown = resetTimer;

function logout() {
    localStorage.setItem("currentUser", "");
    location.reload();
}

usernameInput.focus();

logoutBtn.addEventListener("click", () => {
    logout();
});

loginBtn.addEventListener("click", async () => {
    const unInput = usernameInput.value;
    const password = passwordInput.value;
    const userList = await getUsers();

    for (const user of userList) {
         if (user.username === unInput && user.password === password) {
            document.getElementById("userLogin").classList.toggle("hide");
            container.classList.toggle("show");
            globalUsername = unInput;
            localStorage.setItem("currentUser", globalUsername);
            loadTasks();
        }
    }
    if (globalUsername === "") {
        alert("Invalid username or password.");
    }
    
});

usernameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        loginBtn.click();
    }
});
passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        loginBtn.click();
    }
});

async function getUsers() {
    const response = await fetch('https://tinkr.tech/sdb/todoList/users', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer t7pJ0_sFMA55OP2m-mYXfBHD8z5bYjsK9fxJyJh3FpM'
        }
    });
    return await response.json();
}

async function uploadUser(username, password) {
    const response = await fetch('https://tinkr.tech/sdb/todoList/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer t7pJ0_sFMA55OP2m-mYXfBHD8z5bYjsK9fxJyJh3FpM'
        },
        body: JSON.stringify({ username, password })
    });
    return await response.json();
};

signupBtn.addEventListener("click", async () => {
    const userList = await getUsers();
    for (const user of userList) {
        if (user.username === usernameInput.value) {
            alert("Username already exists.");
            return;
        }
    }
    await uploadUser(usernameInput.value, passwordInput.value);
    alert("User created successfully. You can now log in.");
});

//actual todo list code
//JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g

async function uploadTask(text, completed, username) {
    const response = await fetch('https://tinkr.tech/sdb/todoList/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g'
        },
        body: JSON.stringify({ text, completed, username })
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

async function loadTasks() {
    const tasks = await getTasks();
    for (const task of tasks) {
        addTask(task.text, task.completed, task.id, task.username);
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

async function updateTask(text, completed, id, username) {
    await fetch(`https://tinkr.tech/sdb/todoList/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer JG4NnKsqDSj9NlX0NXNjyknXmGDTbrEhsZpV1RISy6g'
        },
        body: JSON.stringify({"text": text, "completed": completed, "username": username})
    });
}

async function addTask(text, completed, id, username) {
    if (username === globalUsername) {
        const task = document.createElement("li");
        task.textContent = text;

        if (completed === true) {
            task.classList.toggle('completed');
        }
        task.addEventListener('click', () => {
            task.classList.toggle('completed');
            updateTask(text, task.classList.contains('completed'), id, globalUsername);
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
    } else {return;}

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
    await uploadTask(input.value, false, globalUsername);
    let tasks = await getTasks();
    for (const task of tasks) {
        if (task.text === input.value) {
            addTask(task.text, task.completed, task.id, task.username);
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




