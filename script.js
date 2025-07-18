// ----------- CONFIGURATION -----------------
const ADMIN_PASSCODE = "YourSecretPass123"; // Hidden admin password (change this!)
// -------------------------------------------

// DOM Elements
const countdownEl = document.getElementById("countdown");
const enterButton = document.getElementById("enter-button");
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

// Update countdown display & button state
function updateCountdown(targetDate) {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    countdownEl.textContent = "The drawing is happening now!";
    enterButton.textContent = "Enter Now";
    enterButton.classList.remove("disabled");
    enterButton.removeAttribute("aria-disabled");
    enterButton.style.pointerEvents = "auto";
    enterButton.style.backgroundColor = "#28a745"; // Green
    enterButton.href = "https://yourformlink.com"; // Replace with actual form link
    enterButton.tabIndex = 0;
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  countdownEl.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;

  // Disable enter button while countdown is active
  enterButton.textContent = "Not Available";
  enterButton.classList.add("disabled");
  enterButton.setAttribute("aria-disabled", "true");
  enterButton.style.pointerEvents = "none";
  enterButton.style.backgroundColor = "#000000";
  enterButton.href = "javascript:void(0)";
  enterButton.tabIndex = -1;
}

// Load countdown from localStorage
function loadCountdownFromLocalStorage() {
  const savedTimestamp = localStorage.getItem("countdownTarget");
  if (savedTimestamp) {
    countdownTarget = new Date(parseInt(savedTimestamp));
    newDatetimeInput.value = formatDateInput(countdownTarget);
  } else {
    // Default: 7 days from now
    countdownTarget = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    newDatetimeInput.value = formatDateInput(countdownTarget);
    localStorage.setItem("countdownTarget", countdownTarget.getTime());
  }
}

// Call load on page load
loadCountdownFromLocalStorage();

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
  localStorage.setItem("countdownTarget", newTimestamp);
  countdownTarget = new Date(newTimestamp);
  adminMessage.textContent = "Countdown updated successfully!";
  adminMessage.style.color = "green";
  updateCountdown(countdownTarget.getTime());
});
