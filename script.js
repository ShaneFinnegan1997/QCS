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
