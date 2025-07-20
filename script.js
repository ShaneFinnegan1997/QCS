import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
    if (document.querySelector("#header-container")) loadHTML("#header-container", "header-admin.html");
    if (document.querySelector("#footer-container")) loadHTML("#footer-container", "footer.html");
})();

// Admin login
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const inputUsername = document.getElementById("admin-username").value.trim();
        const inputPassword = document.getElementById("admin-password").value.trim();
        const status = document.getElementById("login-status");

        console.log("Entered username:", inputUsername);
        console.log("Entered password:", inputPassword);

        try {
            // 1. Get admin data from the 'admins' node
            const adminsRef = ref(db, 'admins');
            const snapshot = await get(adminsRef);
            const adminsData = snapshot.val();

            console.log("adminsData:", adminsData); // Log the entire adminsData object

            if (!adminsData) {
                status.innerText = "No admins found in the database.";
                return;
            }

            // 2. Find the admin with the matching username and password
            let adminFound = false;
            for (const adminKey in adminsData) {
                const admin = adminsData[adminKey];
                console.log("Checking admin:", admin); // Log each admin object

                if (admin.username === inputUsername && admin.password === inputPassword) {
                    adminFound = true;
                    break;
                }
            }

            if (adminFound) {
                // Login successful
                document.getElementById("login-form").style.display = "none";
                document.getElementById("admin-panel").classList.remove("hidden");
                status.innerText = ""; // Clear any previous status messages
                //loadAdminEvents(); // Assuming this function exists

            } else {
                status.innerText = "Invalid username or password.";
            }
        } catch (error) {
            console.error("Login failed:", error);
            status.innerText = "Login failed: " + error.message;
        }
    });
}
