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
    const enteredPass = document.getElementById("admin-passcode").value.trim();
    const snapshot = await get(ref(db, "admin/passcode"));
    if (!snapshot.exists()) return alert("Admin passcode not set in Firebase.");
    const storedPass = snapshot.val();
    if (enteredPass === storedPass) {
      document.getElementById("admin-panel").classList.remove("hidden");
      document.getElementById("login-form").classList.add("hidden");
      loadAdminEvents(); // Load events after login
    } else {
      alert("Incorrect password.");
    }
  });
}

// Countdown update
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
    const desc = document.getElementById("event-description").value.trim();
    if (!title || !desc) return alert("Title and description required.");
    await push(ref(db, "events"), {
      title,
      description: desc,
      timestamp: new Date().toISOString()
    });
    alert("Event logged!");
    loadAdminEvents(); // Refresh list after logging event
  });
}

// Load events for admin
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

// Delete event by key
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