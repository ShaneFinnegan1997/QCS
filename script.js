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
let countdownInterval;

// Load countdown target from localStorage
if (localStorage.getItem('countdownTarget')) {
    countdownTarget = new Date(localStorage.getItem('countdownTarget')).getTime();
}

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
function updateCountdown() {
    if (!countdownEl || !enterButton) return;

    if (!countdownTarget) {
        countdownEl.textContent = "Timer not set.";
        enterButton.textContent = "Not Available";
        enterButton.classList.add("disabled");
        enterButton.setAttribute("aria-disabled", "true");
        enterButton.style.pointerEvents = "none";
        enterButton.style.backgroundColor = "";
        enterButton.href = "#";
        enterButton.tabIndex = -1;
        return;
    }

    const now = new Date().getTime();
    const distance = countdownTarget - now;

    if (distance <= 0) {
        countdownEl.textContent = "Countdown ended!";
        enterButton.textContent = "Countdown ended";
        enterButton.classList.add("disabled");
        enterButton.removeAttribute("aria-disabled");
        enterButton.style.pointerEvents = "none";
        enterButton.style.backgroundColor = "";
        enterButton.href = "#";
        enterButton.tabIndex = -1;
        clearInterval(countdownInterval); // Stop the interval
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;

    // Disable enter button while countdown active
    enterButton.textContent = "Not Available";
    enterButton.classList.add("disabled");
    enterButton.setAttribute("aria-disabled", "true");
    enterButton.style.pointerEvents = "none";
    enterButton.style.backgroundColor = ""; // Reset
    enterButton.href = "#";
    enterButton.tabIndex = -1;
}

// Admin Login Form Handling
if (adminLoginForm) {
    adminSection.classList.add("hidden"); // Hide admin section by default
    adminLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const enteredPasscode = adminPasscodeInput.value;

        if (enteredPasscode === ADMIN_PASSCODE) {
            // Successful login
            loginMessage.textContent = "Login successful!";
            adminSection.classList.remove("hidden"); // Show the admin section
        } else {
            // Failed login
            loginMessage.textContent = "Incorrect passcode. Please try again.";
            adminSection.classList.add("hidden"); // Ensure admin section is hidden
        }

        adminPasscodeInput.value = ""; // Clear the input
    });
}

// Admin Section - Update Timer
if (adminSection) {
    updateTimerBtn.addEventListener('click', function() {
        const newDatetime = newDatetimeInput.value;
        if (newDatetime) {
            countdownTarget = new Date(newDatetime).getTime();
            localStorage.setItem('countdownTarget', new Date(countdownTarget)); // Store in localStorage
            adminMessage.textContent = "Timer updated!";
			clearInterval(countdownInterval);
            updateCountdown(); // Update immediately
			countdownInterval = setInterval(updateCountdown, 1000);
        } else {
            adminMessage.textContent = "Please select a valid date and time.";
        }
    });

    endTimerBtn.addEventListener('click', function() {
        countdownTarget = null; // Clear the timer
        localStorage.removeItem('countdownTarget'); // Remove from localStorage
        adminMessage.textContent = "Timer ended.";
        updateCountdown(); // Update immediately
		clearInterval(countdownInterval);
    });
}

// Initial call to updateCountdown
updateCountdown();

// Update the countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);
