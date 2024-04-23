const urlAPI = "https://chat-crng.onrender.com";
const entrada = document.querySelector("#entrada");
const statusEntrada = document.querySelector("#status-entrada");
const listaSalas = document.querySelector("#lista-salas");
const mensagensSala = document.querySelector("#mensagens-sala");
const criaSala = document.querySelector("#cria-sala");
const nickUsuario = document.querySelector("#nick-usuario");

const user = {};
let salaAtual = null;

const fetchAPI = async (url, method, bodyData = null) => {
    const headers = {
        "Content-Type": "application/json",
        nick: user.nick,
        token: user.token,
        idUser: user.idUser,
    };

    const config = {
        method,
        headers,
        body: bodyData ? JSON.stringify(bodyData) : null,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    return response.json();
};

const entrarSala = async (nick) => {
    try {
        const data = await fetchAPI(`${urlAPI}/entrar`, "POST", { nick });
        if (data.idUser && data.nick && data.token) {
            user.idUser = data.idUser;
            user.nick = data.nick;
            user.token = data.token;

            entrada.style.display = "none";
            statusEntrada.style.display = "block";
            listaSalas.style.display = "block";
            criaSala.style.display = "block";

            nickUsuario.textContent = user.nick;

            mostrarSalas();
        } else {
            console.error("Resposta da API inválida:", data);
        }
    } catch (error) {
        console.error(error.message);
    }
};

const mostrarSalas = async () => {
    try {
        const data = await fetchAPI(`${urlAPI}/salas`, "GET");
        if (data && data.salas && data.salas.length > 0) {
            listaSalas.innerHTML = `<h2>Salas</h2>${data.salas
                .map((sala) => `<div class="sala" data-id="${sala.id}">${sala.nome}</div>`)
                .join("")}`;
            listaSalas.style.display = "block";
            mensagensSala.style.display = "none";
        } else {
            listaSalas.innerHTML = "<h2>Salas</h2><p>Nenhuma sala encontrada.</p>";
        }
    } catch (error) {
        console.error(error.message);
    }
};

const buscarMensagens = async (salaId) => {
    try {
        const data = await fetchAPI(`${urlAPI}/mensagens/${salaId}`, "GET");
        if (data && data.mensagens) {
            mensagensSala.innerHTML = `<h2>Mensagens</h2>${data.mensagens
                .map((msg) => `<div class="mensagem">${msg.texto}</div>`)
                .join("")}`;
            listaSalas.style.display = "none";
            mensagensSala.style.display = "block";
            salaAtual = salaId;
        } else {
            console.error("Resposta da API não contém dados");
        }
    } catch (error) {
        console.error(error.message);
    }
};

const sairSala = async () => {
    try {
        if (salaAtual) {
            const data = await fetchAPI(`${urlAPI}/sair/${salaAtual}`, "DELETE");
            if (data && data.message) {
                mostrarSalas();
                salaAtual = null;
            } else {
                console.error("Resposta da API não contém dados");
            }
        } else {
            console.error("Nenhuma sala selecionada");
        }
    } catch (error) {
        console.error(error.message);
    }
};

const excluirSala = async (salaId) => {
    try {
        const data = await fetchAPI(`${urlAPI}/excluir/${salaId}`, "DELETE");
        if (data && data.message) {
            mostrarSalas();
        } else {
            console.error("Resposta da API não contém dados");
        }
    } catch (error) {
        console.error(error.message);
    }
};

const sairChat = async () => {
    try {
        const data = await fetchAPI(`${urlAPI}/sair`, "DELETE");
        if (data && data.message) {
            entrada.style.display = "block";
            statusEntrada.style.display = "none";
            listaSalas.style.display = "none";
            mensagensSala.style.display = "none";
            criaSala.style.display = "none";
        } else {
            console.error("Resposta da API não contém dados");
        }
    } catch (error) {
        console.error(error.message);
    }
};

const criarSala = async (nomeSala) => {
    try {
        const data = await fetchAPI(`${urlAPI}/criarSala`, "POST", { nome: nomeSala });
        if (data && data.sala) {
            mostrarSalas();
        } else {
            console.error("Resposta da API não contém dados");
        }
    } catch (error) {
        console.error(error.message);
    }
};

// Event Listeners
document.querySelector("#entrar").addEventListener("click", (evt) => {
    evt.preventDefault();
    const nick = document.querySelector("#input-nick").value;
    entrarSala(nick);
});

document.querySelector("#lista-salas").addEventListener("click", (e) => {
    if (e.target.classList.contains("sala")) {
        const salaId = e.target.dataset.id;
        buscarMensagens(salaId);
    }
});

document.querySelector("#criarSala").addEventListener("click", () => {
    const nomeSala = prompt("Digite o nome da nova sala:");
    if (nomeSala && nomeSala.trim() !== "") {
        criarSala(nomeSala);
    } else {
        alert("Por favor, insira um nome válido para a sala.");
    }
});

document.querySelector("#sairSala").addEventListener("click", () => {
    sairSala();
});

document.querySelector("#excluirSala").addEventListener("click", () => {
    const salaId = prompt("Digite o ID da sala para excluir:");
    if (salaId && salaId.trim() !== "") {
        excluirSala(salaId);
    } else {
        alert("Por favor, insira um ID válido para a sala.");
    }
});

document.querySelector("#sairChat").addEventListener("click", () => {
    sairChat();
});
