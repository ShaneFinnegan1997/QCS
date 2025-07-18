// ----------- CONFIGURATION -----------------
const ADMIN_PASSCODE = ""; // Change this!
const ENTRY_FORM_LINK = "https://yourformlink.com"; // Your actual entry link here
// -------------------------------------------

// DOM Elements (some may not exist on all pages)
const countdownEl = document.getElementById("countdown");
const enterButton = document.getElementById("enter-button");

const adminLoginForm = document.getElementById("admin-login-form");
const adminPasscodeInput = document.getElementById("admin-passcode");
const loginMessage = document.getElementById("login-message");

const adminSection = document.getElementById("admin-section");
const newDatetimeInput = document.getElementById("new-datetime");
const updateTimerBtn = document.getElementById("update-timer-btn");
const endTimerBtn = document.getElementById("end-timer-btn");
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
  if (!countdownEl || !enterButton) return; // If no elements, skip

  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    countdownEl.textContent = "The drawing is happening now!";
    enterButton.textContent = "Enter Now";
    enterButton.classList.remove("disabled");
    enterButton.removeAttribute("aria-disabled");
    enterButton.style.pointerEvents = "auto";
    enterButton.style.backgroundColor = "#28a745"; // Green
    enterButton.href = ENTRY_FORM_LINK;
    enterButton.tabIndex = 0;
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  countdownEl.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;

  // Disable enter button while countdown active
  enterButton.textContent = "Not Available";
  enterButton.clas
