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

  console.log("Updating countdown for:", new Date(targetDate));

  if (distance <= 0) {
    countdownEl.textContent = "The drawing is happening now!";
    enterButton.textCo
