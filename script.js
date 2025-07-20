import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    push,
    onValue,
    remove
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Declare deleteEvent in the global scope
window.deleteEvent = async function(eventId) {
    if (confirm("Are you sure you want to delete this event?")) {
        try {
            await remove(ref(db, "events/" + eventId));
            alert("Event deleted.");
            // Reload events after deletion
            const list = document.getElementById("event-list");
            loadEvents(list);
        } catch (error) {
            alert("Error deleting event: " + error.message);
        }
    }
};

// Login
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const inputUsername = document.getElementById("admin-username").value.trim();
        const inputPassword = document.getElementById("admin-password").value.trim();
        const status = document.getElementById("login-status");

        const snapshot = await get(ref(db, "admin"));
        const adminData = snapshot.val();
        if (!adminData) return (status.innerText = "Admin credentials not set.");

        if (inputUsername === adminData.username && inputPassword === adminData.password) {
            document.getElementById("login-form").style.display = "none";
            document.getElementById("admin-panel").classList.remove("hidden");
            document.getElementById("manage-events").classList.remove("hidden");
            // Ensure you pass the element where events will be loaded
            const list = document.getElementById("event-list");
            loadEvents(list);
        } else {
            status.innerText = "Invalid username or password.";
        }
    });
}

// Update countdown
const updateBtn = document.getElementById("update-countdown");
if (updateBtn) {
    updateBtn.addEventListener("click", async () => {
        const time = document.getElementById("target-time").value;
        const link = document.getElementById("entry-link").value;
        if (!time || !link) return alert("Both time and link required.");
        await set(ref(db, "countdown"), {
            targetTime: new Date(time).toISOString(),
            entryLink: link
        });
        alert("Countdown updated!");
    });
}

// Log event
const logBtn = document.getElementById("log-event");
if (logBtn) {
    logBtn.addEventListener("click", async () => {
        const title = document.getElementById("event-title").value.trim();
        const link = document.getElementById("event-link").value.trim();
        const descInput = document.getElementById("event-description");
        const desc = descInput ? descInput.value.trim() : "";

        if (!title || !desc) return alert("Title and description required.");

        await push(ref(db, "events"), {
            title,
            link: link || null,
            description: desc,
            timestamp: new Date().toISOString()
        });

        alert("Event logged!");
    });
}

// Load events - now accepts a parameter for the list
function loadEvents(list) {
    if (!list) {
        console.error("Event list element not found.");
        return;
    }

    list.innerHTML = "Loading...";
    const eventsRef = ref(db, "events");
    onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        list.innerHTML = "";

        if (data) {
            for (const key in data) {
                const event = data[key];
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>\${event.title}</strong><br>
                    ${event.description ? `<p>${event.description}</p>` : ""}
                    ${event.link ? `<a href="${event.link}" target="_blank">Event Link</a><br>` : ""}
                    <button onclick="deleteEvent('\${key}')">Delete</button>
                `;
                list.appendChild(li);
            }
        } else {
            list.innerHTML
