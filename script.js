document.addEventListener('DOMContentLoaded', function() {
    // --- PASSO 1: CONFIGURAÇÃO DO FIREBASE ---
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyCEd9ZuYZ-3T6ki5THsL25bmx5bjYT8rM0",
      authDomain: "boblox-2007.firebaseapp.com",
      projectId: "boblox-2007",
      storageBucket: "boblox-2007.firebasestorage.app",
      messagingSenderId: "780180767233",
      appId: "1:780180767233:web:66e3cf669b38b0a4497600",
      measurementId: "G-JHE06SY74Q"
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    // const db = firebase.firestore(); // Descomente se for usar o banco de dados

    // --- NAVEGAÇÃO ENTRE PÁGINAS (mesma lógica de antes) ---
    const pageContents = document.querySelectorAll('.page-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTitles = {
        home: 'Boblox - A Virtual Playworld',
        games: 'Games - Boblox',
        catalog: 'Catalog - Boblox',
        myboblox: 'My Boblox - Player',
        forum: 'Forum - Boblox'
    };

    function showPage(pageId) {
        pageContents.forEach(page => page.classList.remove('active'));
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
            if (pageId) showPage(pageId);
        });
    });

    // --- LÓGICA DE LOGIN E AUTENTICAÇÃO REAL ---
    const loginSection = document.getElementById('login-section');

    const loginHTML = `
        <div class="login-box">
            <h3>Member Login</h3>
            <form id="login-form">
                <label for="email">Email</label>
                <input type="email" id="email" required>
                <label for="password">Password</label>
                <input type="password" id="password" required>
                <p id="error-message" style="color:red; font-size:10px;"></p>
                <input type="submit" value="Login" class="btn-login">
                <button type="button" id="register-btn" class="btn-login" style="margin-top:5px; background-color:#4CAF50;">Register New Account</button>
            </form>
        </div>
        <img src="images/default-avatar.png" alt="Default Avatar" class="default-avatar">
    `;

    function showLoginForm() {
        loginSection.innerHTML = loginHTML;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('register-btn').addEventListener('click', handleRegister);
    }
    
    function showWelcomeMessage(user) {
        const username = user.displayName || user.email.split('@')[0];
        loginSection.innerHTML = `
            <div class="login-box">
                <h3>Welcome, ${username}!</h3>
                <p style="margin: 10px 0; font-size:11px;">You are logged in.</p>
                <button id="logout-btn" class="btn-login" style="background-color: #f44336;">Logout</button>
            </div>
             <img src="images/default-avatar.png" alt="Avatar" class="default-avatar">
        `;
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    }

    // --- FUNÇÕES DE AUTENTICAÇÃO DO FIREBASE ---
    
    // VERIFICA O ESTADO DO USUÁRIO (se ele já está logado ou não)
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("Usuário está logado:", user);
            showWelcomeMessage(user);
        } else {
            console.log("Nenhum usuário logado.");
            showLoginForm();
        }
    });
    
    // FUNÇÃO DE LOGIN
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Login bem-sucedido, onAuthStateChanged vai cuidar do resto
            })
            .catch(error => {
                console.error("Erro de login:", error);
                errorMessage.textContent = error.message;
            });
    }

    // FUNÇÃO DE REGISTRO
    function handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
        
        if(password.length < 6) {
            errorMessage.textContent = "Password must be at least 6 characters.";
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Registro bem-sucedido, onAuthStateChanged vai cuidar do resto
                alert('Account created successfully! You are now logged in.');
            })
            .catch(error => {
                console.error("Erro de registro:", error);
                errorMessage.textContent = error.message;
            });
    }
    
    // FUNÇÃO DE LOGOUT
    function handleLogout() {
        auth.signOut().then(() => {
            // Logout bem-sucedido, onAuthStateChanged vai cuidar de mostrar o form de login
        }).catch(error => {
            console.error("Erro de logout:", error);
        });
    }

    // --- INICIALIZAÇÃO ---
    showPage('home'); // Mostra a página inicial ao carregar
});
