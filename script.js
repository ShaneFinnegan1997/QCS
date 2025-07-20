const firebaseConfig = {
    apiKey: "AIzaSyD-giQ4CGXX6F0RIXbAzbp_0vDDomoLo8g",
    authDomain: "qcsweeps-4b994.firebaseapp.com",
    databaseURL: "https://qcsweeps-4b994-default-rtdb.firebaseio.com",
    projectId: "qcsweeps-4b994",
    storageBucket: "qcsweeps-4b994.appspot.com",
    messagingSenderId: "810241609281",
    appId: "1:810241609281:web:63ecd22b6acbee2cf480c0",
    measurementId: "G-XL9VQ985S9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Announcement Function
function sendAnnouncement() {
    const title = document.getElementById("announcement-title").value;
    const message = document.getElementById("announcement-message").value;

    db.ref("announcement").set({
        title: title,
        message: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("Announcement sent to database!");
        document.getElementById("announcement-title").value = "";
        document.getElementById("announcement-message").value = "";
    }).catch(error => {
        console.error("Error sending announcement: ", error);
        alert("Failed to send announcement.");
    });
}

function displayAnnouncement(title, message) {
    const announcementArea = document.getElementById("announcement-area");
    const announcementTitleDisplay = document.getElementById("announcement-title-display");
    const announcementMessageDisplay = document.getElementById("announcement-message-display");

    if (announcementArea && announcementTitleDisplay && announcementMessageDisplay) {
        announcementTitleDisplay.textContent = title;
        announcementMessageDisplay.textContent = message;
        announcementArea.style.display = "block";
    } else {
        console.warn("Announcement elements not found in header. Check your header. Make sure the function runs after the header has loaded");
    }
}

function clearAnnouncement() {
    const announcementArea = document.getElementById("announcement-area");
    if (announcementArea) {
        announcementArea.style.display = "none";
    }
    const announcementTitleDisplay = document.getElementById("announcement-title-display");
    const announcementMessageDisplay = document.getElementById("announcement-message-display");
    if (announcementTitleDisplay) announcementTitleDisplay.textContent = "";
    if (announcementMessageDisplay) announcementMessageDisplay.textContent = "";
}
// Load existing announcement on page load and listen for updates
function loadAnnouncement() {
    const announcementRef = db.ref("announcement");
    if (announcementRef) {
        db.ref("announcement").on("value", (snapshot) => {
            const announcement = snapshot.val();
            console.log("Announcement data:", announcement);

            if (announcement) {
                displayAnnouncement(announcement.title, announcement.message);
            } else {
                //No announcement so clear it from view
                clearAnnouncement();
            }
        });
    }
}

// Check login on page load
window.onload = () => {
    const user = localStorage.getItem("adminUser");
    if (user) showAdminPanel();
    loadAnnouncement()
};

// Load header/footer
async function loadHTML(selector, url) {
    try {
        const res = await fetch(url);
        if (res.ok) {
            const html = await res.text();
            document.querySelector(selector).innerHTML = html;
        }
    } catch (e) {
        console.error("Failed to load:", url);
    }
}
loadHTML("#header-container", "header-admin.html");
loadHTML("#footer-container", "footer.html");

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    db.ref("admins/" + username).once("value").then(snapshot => {
        const data = snapshot.val();
        if (data && data.password === password) {
            localStorage.setItem("adminUser", username);
            showAdminPanel();
        } else {
            alert("Invalid username or password");
        }
    });
}

function showAdminPanel() {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    loadEvents();
    loadUsers();
    loadSweepstakes();
}

function logout() {
    localStorage.removeItem("adminUser");
    location.reload();
}

// Countdown Timer Function
function updateCountdown() {
    const targetTime = document.getElementById("target-time").value;
    const entryLink = document.getElementById("entry-link").value;

    db.ref("countdown").set({
        targetTime,
        entryLink
    });
    alert("Countdown updated!");
}

// Event Management Functions
function addEvent() {
    const title = document.getElementById("event-title").value;
    const link = document.getElementById("event-link").value;
    const description = document.getElementById("event-description").value; // Get description

    const eventRef = db.ref("events").push();
    eventRef.set({
        title,
        link,
        description
    }); // Save description
    document.getElementById("event-title").value = "";
    document.getElementById("event-link").value = "";
    document.getElementById("event-description").value = ""; // Clear description
    loadEvents(); // Refresh the event list
}

// Corrected deleteEvent function
function deleteEvent(key) {
    if (confirm("Are you sure you want to delete this event?")) {
        db.ref("events/" + key).remove().then(() => {
            alert("Event deleted successfully!");
            loadEvents(); // Refresh the event list
        }).catch(error => {
            console.error("Error deleting event: ", error);
            alert("Failed to delete event.");
        });
    }
}
// -----------------------------------------------------------------------

function loadEvents() {
    const list = document.getElementById("event-list");
    list.innerHTML = "";
    db.ref("events").once("value").then(snapshot => {
        snapshot.forEach(child => {
            const event = child.val();
            const li = document.createElement("li");
            li.innerHTML = `
    <strong>\${event.title}</strong><br>
    <a href="\${event.link}" target="_blank">Link</a><br>
    ${event.description ? `<p>${event.description}</p>` : ''}
    <div class="event-actions">
      <button onclick="deleteEvent('\${child.key}')">Delete</button>
    </div>
  `;
            list.appendChild(li);
        });
    });
}

// User Management Functions
function addUser() {
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;

    db.ref("admins/" + username).set({
        password: password
    }).then(() => {
        alert("User added successfully!");
        document.getElementById("new-username").value = "";
        document.getElementById("new-password").value = "";
        loadUsers();
    }).catch(error => {
        console.error("Error adding user: ", error);
        alert("Failed to add user.");
    });
}

function deleteUser(username) {
    if (confirm("Are you sure you want to delete this user?")) {
        db.ref("admins/" + username).remove().then(() => {
            alert("User deleted successfully!");
            loadUsers();
        }).catch(error => {
            console.error("Error deleting user: ", error);
            alert("Failed to delete user.");
        });
    }
}

function loadUsers() {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";
    db.ref("admins").once("value").then(snapshot => {
        snapshot.forEach(child => {
            const username = child.key;
            const li = document.createElement("li");
            li.textContent = username;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => deleteUser(username);
            li.appendChild(deleteBtn);
            userList.appendChild(li);
        });
    });
}

// Sweepstakes Management Functions
function addSweepstakes() {
    const title = document.getElementById("sweepstakes-title").value;
    const description = document.getElementById("sweepstakes-description").value;
    const start = document.getElementById("sweepstakes-start").value;
    const end = document.getElementById("sweepstakes-end").value;
    const winners = document.getElementById("sweepstakes-winners").value;

    db.ref("sweepstakes").push().set({
        title: title,
        description: description,
        start: start,
        end: end,
        winners: winners
    }).then(() => {
        alert("Sweepstakes added successfully!");
        document.getElementById("sweepstakes-title").value = "";
        document.getElementById("sweepstakes-description").value = "";
        document.getElementById("sweepstakes-start").value = "";
        document.getElementById("sweepstakes-end").value = "";
        document.getElementById("sweepstakes-winners").value = "";
        loadSweepstakes();
    }).catch(error => {
        console.error("Error adding sweepstakes: ", error);
        alert("Failed to add sweepstakes.");
    });
}

function deleteSweepstakes(key) {
    if (confirm("Are you sure you want to delete this sweepstakes?")) {
        db.ref("sweepstakes/" + key).remove().then(() => {
            alert("Sweepstakes deleted successfully!");
            loadSweepstakes();
        }).catch(error => {
            console.error("Error deleting sweepstakes: ", error);
            alert("Failed to delete sweepstakes.");
        });
    }
}

function loadSweepstakes() {
    const sweepstakesList = document.getElementById("sweepstakes-list");
    sweepstakesList.innerHTML = "";
    db.ref("sweepstakes").once("value").then(snapshot => {
        snapshot.forEach(child => {
            const sweepstakes = child.val();
            const li = document.createElement("li");
            li.innerHTML = `
        <strong>\${sweepstakes.title}</strong><br>
        <p>\${sweepstakes.description}</p>
        <p>Start: \${sweepstakes.start}</p>
        <p>End: \${sweepstakes.end}</p>
        <p>Winners: \${sweepstakes.winners}</p>
        <button onclick="deleteSweepstakes('\${child.key}')">Delete</button>
    `;
            sweepstakesList.appendChild(li);
        });
    });
}
