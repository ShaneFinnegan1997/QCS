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
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyD-giQ4CGXX6F0RIXbAzbp_0vDDomoLo8g",
    
    databaseURL: "https://qcsweeps-4b994-default-rtdb.firebaseio.com",
    projectId: "qcsweeps-4b994",
    storageBucket: "qcsweeps-4b994.appspot.com",
    messagingSenderId: "810241609281",
    appId: "1:810241609281:web:63ecd22b6acbee2cf480c0"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth(app);

  // Load header/footer
  (async () => {
    const loadHTML = async (selector, url) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          document.querySelector(selector).innerHTML = await res.text();

          // Manually trigger the announcement script after loading header.html
          if (selector === "#header-container") {
            
const announcementTextElement = document.getElementById('announcement-text');
            const announcementTimestampElement = document.getElementById('announcement-timestamp');

            // Announcement code
            const announcementRef = ref(db, 'announcement');

            onValue(announcementRef, (snapshot) => {
              const announcement = snapshot.val();
              if (announcement && announcement.text) {
                announcementTextElement.textContent = announcement.text;
                announcementTimestampElement.textContent = "Last Updated: " + (new Date(announcement.timestamp)).toLocaleString();
              } else {
                announcementTextElement.textContent = 'No announcement currently.';
                announcementTimestampElement.textContent = "";
              }
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (document.querySelector("#header-container")) loadHTML("#header-container", "header-admin.html");
    if (document.querySelector("#footer-container")) loadHTML("#footer-container", "footer.html");

    // Load Events
    const eventsList = document.getElementById("events-list");
    if (eventsList) {
      const eventsRef = ref(db, "events");

      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          eventsList.innerHTML = ''; // Clear loading
          Object.keys(data).forEach(key => {
            const event = data[key];
            const eventDiv = document.createElement('div');
            eventDiv.className = "event";
            eventDiv.innerHTML = `
              <h2>\${event.title}</h2>
              <p>\${event.description}</p>
              <p><strong>Total Winnings:</strong> \${event.totalWinnings || 'N/A'}</p>
              <p><strong>Winner Payout Amount:</strong> \${event.winnerPayoutAmount || 'N/A'}</p>
              <p><strong>Non-Profit Name:</strong> \${event.nonProfitName || 'N/A'}</p>
              <p><strong>Non-Profit Donation Amount:</strong> \${event.nonProfitDonationAmount || 'N/A'}</p>
              <p><strong>Non-Profit Website Link:</strong> <a href="${event.nonProfitWebsiteLink || '#'}" target="_blank">${event.nonProfitName || 'Visit Website'}</a></p>
              <p><strong>Website Funds Amount:</strong> \${event.websiteFundsAmount || 'N/A'}</p>
            `;
            eventsList.appendChild(eventDiv);
          });
        } else {
          eventsList.innerHTML = '<p>No events found.</p>';
        }
      });
    }
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

      // Retrieve additional event data from admin panel
      const totalWinnings = document.getElementById("event-total-winnings").value.trim();
      const winnerPayoutAmount = document.getElementById("event-winner-payout").value.trim();
      const nonProfitName = document.getElementById("event-nonprofit-name").value.trim();
      const nonProfitDonationAmount = document.getElementById("event-nonprofit-donation").value.trim();
      const nonProfitWebsiteLink = document.getElementById("event-nonprofit-website").value.trim();
      const websiteFundsAmount = document.getElementById("event-website-funds").value.trim();

      if (!title || !desc) return alert("Title and description required.");
      await push(ref(db, "events"), {
        title,
        description: desc,
        timestamp: new Date().toISOString(),

        // Include new data
        totalWinnings: totalWinnings,
        winnerPayoutAmount: winnerPayoutAmount,
        nonProfitName: nonProfitName,
        nonProfitDonationAmount: nonProfitDonationAmount,
        nonProfitWebsiteLink: nonProfitWebsiteLink,
        websiteFundsAmount: websiteFundsAmount
      });
      alert("Event logged!");
      loadAdminEvents();
    });
  }

  // Load events for Admin Panel
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
            <button onclick="window.deleteEvent('\${key}')">Delete</button>
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
        loadAdminEvents(); // Reload events after deletion
      } catch (error) {
        alert("Error deleting event: " + error.message);
      }
    }
  };
});