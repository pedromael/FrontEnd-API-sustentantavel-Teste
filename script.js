const API_URL = "https://api-sustentavel-com-jwt.onrender.com:8000";

// Função de Login
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        document.getElementById("login-section").style.display = "none";
        document.getElementById("register-section").style.display = "none";
        document.getElementById("actions-section").style.display = "block";
        document.getElementById("actions-list").style.display = "block";
        document.getElementById("logaut").style.display = "block";
        loadActions();
    } else {
        document.getElementById("login-message").innerText = data.message;
    }
}

async function register() {
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;
    const name = document.getElementById("name").value;
    
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
    })

    const data = await response.json();

    if (response.ok) {
        document.getElementById("register-message").innerText = "Usuário cadastrado com sucesso!";
        localStorage.setItem("user_id", data.user_id);
    } else {
        document.getElementById("register-message").innerText = data.message;
    }
}

// Função para Listar Ações
async function loadActions() {
    const response = await fetch(`${API_URL}/actions/`);
    const actions = await response.json();

    const actionsContainer = document.getElementById("actions-container");
    actionsContainer.innerHTML = "";

    actions.forEach(action => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${action.title}</strong> - ${action.category} - ${action.points} XP - ${action.user_name} <button onclick="deleteAction(${action.id})">Eliminar</button>`;
        actionsContainer.appendChild(li);
    });
}

// Função para Cadastrar Ação
async function registerAction() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const points = document.getElementById("points").value;
    const user_id = localStorage.getItem("user_id");

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/actions/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, category, points, user_id }),
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("action-message").innerText = "Ação cadastrada com sucesso!";
        loadActions();
    } else {
        document.getElementById("action-message").innerText = data.message;
    }
    loadActions();
}

// Função para Eliminar Ação
async function deleteAction(actionId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/actions/${actionId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (response.ok) {
        document.getElementById("action-message").innerText = "Ação eliminada com sucesso!";
        loadActions();
    } else {
        document.getElementById("action-message").innerText = data.message;
    }
}

// Verifica se o usuário já está logado
if (localStorage.getItem("token")) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("register-section").style.display = "none";
    document.getElementById("actions-section").style.display = "block";
    document.getElementById("actions-list").style.display = "block";
    document.getElementById("logaut").style.display = "block";
    loadActions();
}else{
    document.getElementById("login-section").style.display = "block";
    document.getElementById("register-section").style.display = "block";
    document.getElementById("actions-section").style.display = "none";
    document.getElementById("actions-list").style.display = "none";
    document.getElementById("logaut").style.display = "none";
}

function logaut(){
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    document.getElementById("login-section").style.display = "block";
    document.getElementById("register-section").style.display = "block";
    document.getElementById("actions-section").style.display = "none";
    document.getElementById("actions-list").style.display = "none";
    document.getElementById("logaut").style.display = "none";
}

function checarAPI() {
    fetch(`${API_URL}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao verificar a API');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("alert").innerText = data.message;
        })
        .catch(error => {
            document.getElementById("alert").innerText = `Erro: ${error.message}`;
        });
}

checarAPI();
