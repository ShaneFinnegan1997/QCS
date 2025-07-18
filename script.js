// ----------- CONFIGURE YOUR FIREBASE HERE -----------------
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
// -------------------------------------------------------------

// Hidden admin password (keep this secret!)
const ADMIN_PASSCODE = "YourSecretPass123";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const countdownEl = document.getElementById("countdown");
const adminLoginForm = document.getElementById("admin-login-form");
const adminPasscodeInput = document.getElementById("admin-passcode");
const loginMessage = document.getElementById("login-message");
const adminSection = document.getElementById("admin-section");
const newDatetimeInput = document.getElementById("new-datetime");
const updateTimerBtn = document.getElementById("update-timer-btn");
const adminMessage = document.getElementById("admin-message");

// Variables
let countdownTarget = null;

// Format date for input[type=datetime-local]
function formatDateInput(date) {
  const pad = (n) => (n < 10 ? "0" + n : n);
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

// Update countdown display
function updateCountdown(targetDate) {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    countdownEl.textContent = "The drawing is happening now!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  countdownEl.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;
}

// Listen for changes in Firebase realtime database
db.ref("countdownTarget").on("value", (snapshot) => {
  const timestamp = snapshot.val();
  if (timestamp) {
    countdownTarget = new Date(timestamp);
    newDatetimeInput.value = formatDateInput(countdownTarget);
  } else {
    // Default to 1 week from now if no value set
    countdownTarget = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    newDatetimeInput.value = formatDateInput(countdownTarget);
  }
});

// Update countdown every second
setInterval(() => {
  if (countdownTarget) {
    updateCountdown(countdownTarget.getTime());
  }
}, 1000);

// Admin login form handler
adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredPass = adminPasscodeInput.value.trim();
  if (enteredPass === ADMIN_PASSCODE) {
    loginMessage.textContent = "Access granted!";
    loginMessage.style.color = "green";
    adminSection.classList.remove("hidden");
    adminLoginForm.classList.add("hidden");
  } else {
    loginMessage.textContent = "Incorrect passcode.";
    loginMessage.style.color = "red";
  }
});

// Update timer button handler
updateTimerBtn.addEventListener("click", () => {
  const newDatetime = newDatetimeInput.value;
  if (!newDatetime) {
    adminMessage.textContent = "Please select a valid date and time.";
    adminMessage.style.color = "red";
    return;
  }
  const newTimestamp = new Date(newDatetime).getTime();
  db.ref("countdownTarget")
    .set(newTimestamp)
    .then(() => {
      adminMessage.textContent = "Countdown updated successfully!";
      adminMessage.style.color = "green";
    })
    .catch((error) => {
      adminMessage.textContent = "Error updating countdown.";
      adminMessage.style.color = "red";
      console.error(error);
    });
});
