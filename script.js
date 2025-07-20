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

// Delete event
async function deleteEvent(eventId) {
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      await remove(ref(db, "events/" + eventId));
      alert("Event deleted.");
      loadAdminEvents();  // Reload events after deletion
    } catch (error) {
      alert("Error deleting event: " + error.message);
    }
  }
}

// Make deleteEvent globally accessible
window.deleteEvent = deleteEvent;

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
          <strong>\${event.title}</strong><br/>
          ${event.description ? `<p>${event.description}</p>` : ""}
          ${event.link ? `<a href="${event.link}" target="_blank">Event Link</a><br/>` : ""}
          <button onclick="deleteEvent('\${key}')">Delete</button>
          <hr/>
        `;
        list.appendChild(div);
      }
    } else {
      list.innerHTML = "<p>No events found.</p>";
    }
  });
}

// Function to display the announcement
function displayAnnouncement(title, message) {
    const announcementArea = document.getElementById("announcement-area");
    const announcementTitleDisplay = document.getElementById("announcement-title-display");
    const announcementMessageDisplay = document.getElementById("announcement-message-display");

    if (announcementTitleDisplay && announcementMessageDisplay && announcementArea) {
        announcementTitleDisplay.textContent = title;
        announcementMessageDisplay.textContent = message;
        announcementArea.style.display = "block"; // Make the announcement area visible
    } else {
        console.warn("Announcement elements not found in header. Check your header.html.");
    }
}

// Function to clear the announcement
function clearAnnouncement() {
    const announcementArea = document.getElementById("announcement-area");

    if(announcementArea){
        announcementArea.style.display = "none"; // Hide the announcement area
    }

    const announcementTitleDisplay = document.getElementById("announcement-title-display");
    const announcementMessageDisplay = document.getElementById("announcement-message-display");

    if(announcementTitleDisplay && announcementMessageDisplay) {
        announcementTitleDisplay.textContent = "";
        announcementMessageDisplay.textContent = "";
    }
}

// Load existing announcement on page load and listen for updates
const announcementRef = ref(db, "announcement");
if(announcementRef) {
    onValue(announcementRef, (snapshot) => {
        const announcement = snapshot.val();

        if (announcement) {
            displayAnnouncement(announcement.title, announcement.message);
        } else {
            //No announcement so clear it from view
            clearAnnouncement();
        }
    });
}
