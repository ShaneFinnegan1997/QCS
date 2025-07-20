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
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; // Import Firebase Auth


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
const auth = getAuth(app); // Initialize Firebase Auth

// Announcement Code
const announcementRef = ref(db, 'announcement');
const announcementTextElement = document.getElementById('announcement-text');
const adminLoginButton = document.getElementById('admin-login-button');
const adminLoginPopup = document.getElementById('admin-login-popup');
const adminLoginSubmitButton = document.getElementById('admin-login-submit');
const adminLoginCancelButton = document.getElementById('admin-login-cancel');
const adminEmailInput = document.getElementById('admin-email');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginError = document.getElementById('admin-login-error');
const adminEditPopup = document.getElementById('admin-edit-popup');
const adminAnnouncementTextarea = document.getElementById('admin-announcement-text');
const adminAnnouncementSaveButton = document.getElementById('admin-announcement-save');
const adminAnnouncementCancelButton = document.getElementById('admin-announcement-cancel');

let isAdminLoggedIn = false;

// Function to show the admin login popup
function showAdminLoginPopup() {
  adminLoginPopup.style.display = 'block';
}

// Function to hide the admin login popup
function hideAdminLoginPopup() {
  adminLoginPopup.style.display = 'none';
  adminEmailInput.value = '';
  adminPasswordInput.value = '';
  adminLoginError.textContent = '';
}

// Function to show the admin edit popup
function showAdminEditPopup() {
  adminEditPopup.style.display = 'block';
  get(announcementRef).then((snapshot) => {
    const announcement = snapshot.val();
    adminAnnouncementTextarea.value = announcement || '';
  });

}

// Function to hide the admin edit popup
function hideAdminEditPopup() {
  adminEditPopup.style.display = 'none';
}

// Event listener for the admin login button
adminLoginButton.addEventListener('click', () => {
  if (isAdminLoggedIn) {
    showAdminEditPopup();
  } else {
    showAdminLoginPopup();
  }
});

// Event listener for the admin login submit button
adminLoginSubmitButton.addEventListener('click', () => {
  const email = adminEmailInput.value;
  const password = adminPasswordInput.value;

  signInWithEmailAndPassword(auth, email, password) // Use Firebase Auth
    .then((userCredential) => {
      hideAdminLoginPopup();
      isAdminLoggedIn = true;
      adminLoginButton.textContent = 'Edit Announcement';
      showAdminEditPopup();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      adminLoginError.textContent = 'Login failed: ' + errorMessage;
    });
});

// Event listener for the admin login cancel button
adminLoginCancelButton.addEventListener('click', hideAdminLoginPopup);

// Event listener for the admin announcement save button
adminAnnouncementSaveButton.addEventListener('click', () => {
  const newAnnouncement = adminAnnouncementTextarea.value;

  set(announcementRef, newAnnouncement)
    .then(() => {
      hideAdminEditPopup();
      alert('Announcement updated successfully!');
    })
    .catch((error) => {
      console.error('Error updating announcement:', error);
      alert('Error updating announcement.');
    });
});

// Event listener for the admin announcement cancel button
adminAnnouncementCancelButton.addEventListener('click', hideAdminEditPopup);

onValue(announcementRef, (snapshot) => {
  const announcement = snapshot.val();
  if (announcement) {
    announcementTextElement.textContent = announcement;
  } else {
    announcementTextElement.textContent = 'No announcement currently.';
  }
});

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
    const desc = document.getElementById("event-description").value.trim();
    if (!title || !desc) return alert("Title and description required.");
    await push(ref(db, "events"), {
      title,
      description: desc,
      timestamp: new Date().toISOString()
    });
    alert("Event logged!");
    loadAdminEvents();
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
          <strong>\${event.title}</strong><br/>
          <p>\${event.description || ""}</p>
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
