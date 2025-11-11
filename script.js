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

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- LÓGICA DE NAVEGAÇÃO ---
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

    // --- LÓGICA DE LOGIN E AUTENTICAÇÃO ---
    const loginSection = document.getElementById('login-section');
    const authFormHTML = `
        <div class="login-box">
            <h3 id="form-title">Member Login</h3>
            <form id="auth-form">
                <div id="username-field-container"></div> 
                <label for="email">Email</label>
                <input type="email" id="email" required>
                <label for="password">Password (6+ characters)</label>
                <input type="password" id="password" required>
                <p id="error-message" style="color:red; font-size:10px; min-height: 12px;"></p>
                <input type="submit" id="submit-btn" value="Login" class="btn-login">
                <button type="button" id="toggle-form-btn" class="btn-login" style="margin-top:5px; background-color:#4CAF50;">Need an account? Register</button>
            </form>
        </div>
        <img src="images/default-avatar.png" alt="Default Avatar" class="default-avatar">
    `;
    function showWelcomeMessage(user, userData) {
        const username = userData.username || user.email.split('@')[0];
        const profilePic = userData.profilePictureUrl || 'images/default-avatar.png';
        const profilePageTitle = document.querySelector('#page-myboblox .page-title');
        if (profilePageTitle) profilePageTitle.textContent = `${username}'s Page`;
        loginSection.innerHTML = `
            <div class="login-box">
                <h3>Welcome, ${username}!</h3>
                <p style="margin:5px 0; font-size:10px;">${user.emailVerified ? '<span style="color:green;">Email Verified</span>' : '<strong style="color:orange;">Please verify your email.</strong>'}</p>
                <a href="#" class="nav-link profile-button" data-page="myboblox" style="display:block; text-align:center; text-decoration:none; padding: 5px; margin-bottom:5px;">Go to My Boblox</a>
                <button id="logout-btn" class="btn-login" style="background-color: #f44336;">Logout</button>
            </div>
             <img src="${profilePic}" alt="Avatar" class="default-avatar">
        `;
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        loginSection.querySelector('.nav-link[data-page="myboblox"]').addEventListener('click', (e) => {
            e.preventDefault();
            showPage('myboblox');
        });
    }
    function showAuthForm(isRegisterView = false) {
        loginSection.innerHTML = authFormHTML;
        const form = document.getElementById('auth-form');
        const title = document.getElementById('form-title');
        const usernameContainer = document.getElementById('username-field-container');
        const submitBtn = document.getElementById('submit-btn');
        const toggleBtn = document.getElementById('toggle-form-btn');
        form.removeEventListener('submit', handleLogin);
        form.removeEventListener('submit', handleRegister);
        if (isRegisterView) {
            title.textContent = 'Register New Account';
            usernameContainer.innerHTML = `<label for="username">Username</label><input type="text" id="username" required>`;
            submitBtn.value = 'Register';
            toggleBtn.textContent = 'Already have an account? Login';
            form.addEventListener('submit', handleRegister);
            toggleBtn.addEventListener('click', () => showAuthForm(false));
        } else {
            title.textContent = 'Member Login';
            usernameContainer.innerHTML = '';
            submitBtn.value = 'Login';
            toggleBtn.textContent = 'Need an account? Register';
            form.addEventListener('submit', handleLogin);
            toggleBtn.addEventListener('click', () => showAuthForm(true));
        }
    }
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDocRef = db.collection('users').doc(user.uid);
            const userDoc = await userDocRef.get();
            showWelcomeMessage(user, userDoc.exists ? userDoc.data() : {});
        } else {
            showAuthForm(false);
        }
    });
    function handleLogin(e) { e.preventDefault(); auth.signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value).catch(error => document.getElementById('error-message').textContent = error.message); }
    function handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username').value;
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = '';
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                user.sendEmailVerification();
                return db.collection('users').doc(user.uid).set({
                    username: username,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    profilePictureUrl: 'images/default-avatar.png' 
                });
            })
            .then(() => { alert('Account created! Please check your email to verify your account.'); })
            .catch(error => { errorMessage.textContent = error.message; });
    }
    function handleLogout() { auth.signOut(); }
    showPage('home');
});
