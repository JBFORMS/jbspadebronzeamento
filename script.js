// --- CONFIGURAÇÕES DE LOGIN ---
const VALID_USERNAME = "admin"; // Defina seu nome de usuário
const VALID_PASSWORD = "123"; // Defina sua senha
// --- FIM DAS CONFIGURAÇÕES DE LOGIN ---


// --- Variáveis de DOM (elementos da página) ---
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginMessage = document.getElementById('loginMessage');

const formsContainer = document.getElementById('formsContainer');
const modal = document.getElementById('addFormModal');
// --- FIM Variáveis de DOM ---


// --- Lógica de Autenticação ---
function login() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    if (usernameInput === VALID_USERNAME && passwordInput === VALID_PASSWORD) {
        localStorage.setItem('isAuthenticated', 'true'); // Marca o usuário como autenticado
        checkAuthentication(); // Redireciona para o painel
        loginMessage.style.display = 'none'; // Esconde mensagens de erro
    } else {
        loginMessage.textContent = 'Usuário ou senha inválidos.';
        loginMessage.style.display = 'block'; // Mostra a mensagem de erro
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('isAuthenticated'); // Remove o status de autenticação
        window.location.reload(); // Recarrega a página, levando de volta para a tela de login
    }
}

function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
        loginScreen.style.display = 'none'; // Esconde a tela de login
        adminPanel.style.display = 'flex'; // Mostra o painel de controle (alterado para flex para funcionar com as novas classes CSS)
        loadForms(); // Carrega os formulários se estiver autenticado
    } else {
        loginScreen.style.display = 'flex'; // Mostra a tela de login
        adminPanel.style.display = 'none'; // Esconde o painel de controle
    }
}

// --- Fim Lógica de Autenticação ---


// --- Lógica do Painel de Formulários (já existente, adaptada) ---
let forms = []; // Array para armazenar os formulários
    
// Função para abrir o modal
function openModal() {
    modal.style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    modal.style.display = 'none';
    // Limpar campos do formulário ao fechar, caso o usuário desista
    document.getElementById('formName').value = '';
    document.getElementById('formDescription').value = '';
    document.getElementById('formLink').value = '';
}

// Função para adicionar novo formulário
function addNewForm() {
    const name = document.getElementById('formName').value.trim(); // .trim() para remover espaços em branco
    const description = document.getElementById('formDescription').value.trim();
    const link = document.getElementById('formLink').value.trim();
    
    if (name && link) {
        // Validação básica de URL para o link
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(link)) {
            alert('Por favor, insira um link de formulário válido (ex: https://meusite.com/formulario).');
            return;
        }

        const newForm = {
            id: Date.now(),
            name,
            description,
            link,
            date: new Date().toLocaleDateString('pt-BR')
        };
        
        forms.push(newForm);
        saveForms();
        renderForms();
        closeModal(); // Fechar modal após adicionar
        
    } else {
        alert('Por favor, preencha pelo menos o nome e o link do formulário.');
    }
}

// Função para renderizar os formulários na tela
function renderForms() {
    formsContainer.innerHTML = '';
    
    if (forms.length === 0) {
        formsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6c757d;">
                <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <h3>Nenhum formulário criado ainda</h3>
                <p>Adicione seu primeiro formulário clicando no botão "Adicionar Novo Formulário"</p>
            </div>
        `;
        return;
    }
    
    forms.forEach(form => {
        const formCard = document.createElement('div');
        formCard.className = 'form-card';
        formCard.innerHTML = `
            <div class="form-card-header">
                <h3>${form.name}</h3>
            </div>
            <div class="form-card-body">
                <p class="form-card-desc">${form.description || 'Sem descrição'}</p>
                <p><strong>Data de criação:</strong> ${form.date}</p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <a href="${form.link}" target="_blank" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-external-link-alt"></i> Acessar
                    </a>
                    <button class="btn" style="background: var(--danger-color);" onclick="deleteForm(${form.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        formsContainer.appendChild(formCard);
    });
}

// Função para excluir um formulário
function deleteForm(id) {
    if (confirm('Tem certeza que deseja excluir este formulário?')) {
        forms = forms.filter(form => form.id !== id);
        saveForms();
        renderForms();
    }
}

// Função para salvar formulários no localStorage
function saveForms() {
    localStorage.setItem('clientForms', JSON.stringify(forms));
}

// Função para carregar formulários do localStorage
function loadForms() {
    const savedForms = localStorage.getItem('clientForms');
    if (savedForms) {
        forms = JSON.parse(savedForms);
    }
    renderForms();
}

// Fechar o modal clicando fora dele
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
};

// Evento para o Enter na tela de login
document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});
document.getElementById('username').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('password').focus(); // Move o foco para a senha
    }
});


// Carregar formulários e verificar autenticação quando a página for carregada
document.addEventListener('DOMContentLoaded', checkAuthentication);
// --- Fim Lógica do Painel de Formulários ---