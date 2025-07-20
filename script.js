import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
    getAuth,
    signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyD-giQ4CGXX6F0RIXbAzbp_0vDDomoLo8g",
    authDomain: "qcsweeps-4b994.firebaseapp.com",
    databaseURL: "https://qcsweeps-4b994-default-rtdb.firebaseio.com",
    projectId: "qcsweeps-4b994",
    storageBucket: "qcsweeps-4b994.appspot.com",
    messagingSenderId: "810241609281",
    appId: "1:810241609281:web:63ecd22b6acbee2cf480c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const functions = getFunctions(app);

// Load header/footer
(async () => {
    const loadHTML = async (selector, url) => {
        try {
            const res = await fetch(url);
            if (res.ok) {
                document.querySelector(selector).innerHTML = await res.text();
            }
        } catch (e) {
            console.error(e);
        }
    };
    if (document.querySelector("#header-container")) loadHTML("#header-container", "header.html");
    if (document.querySelector("#footer-container")) loadHTML("#footer-container", "footer.html");
})();

// Admin login
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const inputUsername = document.getElementById("admin-username").value.trim();
        const inputPassword = document.getElementById("admin-password").value.trim();
        const status = document.getElementById("login-status");

        // Get the function
        const generateCustomToken = httpsCallable(functions, 'generateCustomToken');

        try {
            // Call the function with the username and password
            const result = await generateCustomToken({
                username: inputUsername,
                password: inputPassword
            });

            // Get the token from the result
            const token = result.data.token;

            // Sign in with the custom token
            await signInWithCustomToken(auth, token);

            // Hide the login form and show the admin panel
            document.getElementById("login-form").style.display = "none";
            document.getElementById("admin-panel").classList.remove("hidden");
            document.getElementById("manage-events").classList.remove("hidden");

            // Load admin events (assuming this function exists)
            //loadAdminEvents();

        } catch (error) {
            console.error("Login failed:", error);
            status.innerText = "Login failed: " + error.message;
        }
    });
}

// Implement sign out function
const logoutBtn = document.querySelector(".logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await auth.signOut();
            // Show login form and hide admin panel after sign out
            document.getElementById("login-form").style.display = "block";
            document.getElementById("admin-panel").classList.add("hidden");
            document.getElementById("manage-events").classList.add("hidden");
            document.getElementById("login-status").innerText = ""; // Clear status message
        } catch (error) {
            console.error("Sign out failed:", error);
            alert("Sign out failed: " + error.message);
        }
    });
}

// Function to listen for auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        // Hide login form and show admin panel
        document.getElementById("login-form").style.display = "none";
        document.getElementById("admin-panel").classList.remove("hidden");
        document.getElementById("manage-events").classList.remove("hidden");
        document.getElementById("login-status").innerText = ""; // Clear status message
        // loadAdminEvents();
    } else {
        // User is signed out
        console.log("User is signed out");
        // Show login form and hide admin panel
        document.getElementById("login-form").style.display = "block";
        document.getElementById("admin-panel").classList.add("hidden");
        document.getElementById("manage-events").classList.add("hidden");
    }
});
