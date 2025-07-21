import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getDatabase,
ref,
@@ -44,12 +46,17 @@
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
@@ -59,24 +66,26 @@
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