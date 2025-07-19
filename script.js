document.addEventListener("DOMContentLoaded", function () {
  // ----------- CONFIGURATION -----------------
  const ADMIN_PASSCODE = "hello"; // Change this!
  const ENTRY_FORM_LINK = "https://yourformlink.com"; // Your actual entry link here
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
  const endTimerBtn = document.getElementById("end-timer-btn");
  const adminMessage = document.getElementById("admin-message");

  // Variables
  let countdownTarget = null;

  // Hide admin section by default
  if (adminSection) {
    adminSection.classList.add("hidden");
  }

  // Load countdown target from localStorage
  if (localStorage.getItem("countdownTarget")) {
    countdownTarget = new Date(localStorage.getItem("countdownTarget")).getTime();
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
      countdownEl.innerHTML = `Timer not set.`;
      enterButton.innerHTML = `ERROR: Entry Not Available.`;
      enterButton.classList.add("disabled");
      enterButton.setAttribute("aria-disabled", "true");
      enterButton.style.pointerEvents = "none";
      enterButton.style.backgroundColor = "#888";
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
      enterButton.style.pointerEvents = "none";
      enterButton.style.backgroundColor = "#888";
      enterButton.href = "#";
      enterButton.tabIndex = -1;
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;

    enterButton.textContent = "Enter Now";
    enterButton.classList.remove("disabled");
    enterButton.removeAttribute("aria-disabled");
    enterButton.style.pointerEvents = "auto";
    enterButton.style.backgroundColor = "#28a745";
    enterButton.href = ENTRY_FORM_LINK;
    enterButton.tabIndex = 0;
  }

  // Admin Login Form Handling
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const enteredPasscode = adminPasscodeInput.value.trim();

      if (enteredPasscode === ADMIN_PASSCODE) {
        loginMessage.textContent = "Login successful!";
        adminSection.classList.remove("hidden");
      } else {
        loginMessage.textContent = "Incorrect passcode. Please try again.";
        adminSection.classList.add("hidden");
      }

      adminPasscodeInput.value = "";
    });
  }

  // Admin Panel Button Actions
  if (adminSection) {
    updateTimerBtn.addEventListener("click", function () {
      const newDatetime = newDatetimeInput.value;
      if (newDatetime) {
        countdownTarget = new Date(newDatetime).getTime();
        localStorage.setItem("countdownTarget", new Date(countdownTarget));
        adminMessage.textContent = "Timer updated!";
        updateCountdown();
      } else {
        adminMessage.textContent = "Please select a valid date and time.";
      }
    });

    endTimerBtn.addEventListener("click", function () {
      countdownTarget = null;
      localStorage.removeItem("countdownTarget");
      adminMessage.textContent = "Timer ended.";
      updateCountdown();
    });
  }

  // Start
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
});