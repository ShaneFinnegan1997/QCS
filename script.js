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



// Admin login
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
      loadAdminEvents();
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
  const desc = document.getElementById("event-description").value.trim();

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

// Load events
function loadAdminEvents() {
  const list = document.getElementById("admin-events-list");
  if (!list) return;

  list.innerHTML = "Loading...";
  const eventsRef = ref(db, "events");
  onValue(eventsRef, (snapshot) => {
    const data = snapshot.val();
    list.innerHTML = "";

    if (data) {
      const entries = Object.entries(data).reverse();
      for (const [key, event] of entries) {
        const div = document.createElement("div");
        div.className = "admin-event-item";
        div.innerHTML = `
          <strong>${event.title}</strong><br/>
          <p>${event.description || ""}</p>
          <button onclick="deleteEvent('${key}')">Delete</button>
          <hr/>
        `;
        list.appendChild(div);
      }
    } else {
      list.innerHTML = "<p>No events found.</p>";
    }
  });
}

// Delete event
window.deleteEvent = async function (eventId) {
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      await remove(ref(db, "events/" + eventId));
      alert("Event deleted.");
    } catch (error) {
      alert("Error deleting event: " + error.message);
    }
  }
};