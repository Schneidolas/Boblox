document.addEventListener('DOMContentLoaded', function() {
    
    // --- NAVEGAÇÃO ENTRE PÁGINAS ---
    const pageContents = document.querySelectorAll('.page-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTitles = {
        home: 'Boblox - A Virtual Playworld',
        games: 'Games - Boblox',
        catalog: 'Catalog - Boblox',
        myboblox: 'My Boblox - Player1',
        forum: 'Forum - Boblox'
    };

    function showPage(pageId) {
        // Esconde todas as páginas
        pageContents.forEach(page => {
            page.classList.remove('active');
        });

        // Mostra a página correta
        const activePage = document.getElementById('page-' + pageId);
        if (activePage) {
            activePage.classList.add('active');
            document.title = pageTitles[pageId] || 'Boblox';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    // --- LÓGICA DE LOGIN ---
    const loginSection = document.getElementById('login-section');

    const originalLoginHTML = `
        <div class="login-box">
            <h3>Member Login</h3>
            <form id="login-form">
                <label for="username">Character Name</label>
                <input type="text" id="username" value="Player1">
                <label for="password">Password</label>
                <input type="password" id="password" value="password">
                <input type="submit" value="Login" class="btn-login">
            </form>
            <a href="#" class="forgot-password">Forgot your password?</a>
        </div>
        <img src="images/default-avatar.png" alt="Default Avatar" class="default-avatar">
    `;

    function showLoginForm() {
        if (!loginSection) return;
        loginSection.innerHTML = originalLoginHTML;
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleLogin);
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value || "Player1";
        showWelcomeMessage(username);
    }

    function showWelcomeMessage(username) {
        if (!loginSection) return;
        loginSection.innerHTML = `
            <div class="login-box">
                <h3>Welcome, ${username}!</h3>
                <p style="margin: 10px 0;">What will you do next?</p>
                <a href="#" class="nav-link profile-button" data-page="myboblox" style="display:block; text-align:center; text-decoration:none; padding: 5px; margin-bottom:5px;">Go to My Boblox</a>
                <button id="logout-btn" class="btn-login" style="background-color: #f44336;">Logout</button>
            </div>
             <img src="images/default-avatar.png" alt="Avatar" class="default-avatar">
        `;
        document.getElementById('logout-btn').addEventListener('click', showLoginForm);
        // Garante que o novo link "My Boblox" também funcione
        document.querySelector('.nav-link[data-page="myboblox"]').addEventListener('click', (e) => {
            e.preventDefault();
            showPage('myboblox');
        });
    }

    // --- INICIALIZAÇÃO ---
    showPage('home'); // Mostra a página inicial ao carregar
    showLoginForm(); // Mostra o formulário de login na página inicial

});
