const ADMIN_PASSCODE = "secret123"; // Change this!

let countdownInterval = null;

function setButtonEnabled(enabled) {
  const enterButton = document.getElementById("enter-button");
  if (!enterButton) return;

  if (enabled) {
    enterButton.classList.remove("disabled");
    enterButton.textContent = "Enter Now";
    enterButton.setAttribute("aria-disabled", "false");
    enterButton.style.pointerEvents = "auto";
  } else {
    enterButton.classList.add("disabled");
    enterButton.textContent = "Not Available";
    enterButton.setAttribute("aria-disabled", "true");
    enterButton.style.pointerEvents = "none";
  }
}

function updateCountdownDisplay(targetDate) {
  const countdownEl = document.getElementById("countdown");
  if (!countdownEl) return;

  if (countdownInterval) clearInterval(countdownInterval);

  function update() {
    const now = new Date();
    const distance = targetDate - now;

    if (distance <= 0) {
      countdownEl.textContent = "Drawing has ended!";
      setButtonEnabled(false);
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    setButtonEnabled(true);
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// Load timer from localStorage on page load
function loadTimer() {
  const savedTime = localStorage.getItem("drawingTime");
  if (!savedTime) {
    // No timer set — disable button & clear countdown
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) countdownEl.textContent = "No drawing scheduled.";
    setButtonEnabled(false);
    return;
  }

  const targetDate = new Date(savedTime);
  if (isNaN(targetDate)) {
    // Invalid date saved — clear it
    localStorage.removeItem("drawingTime");
    setButtonEnabled(false);
    return;
  }

  updateCountdownDisplay(targetDate);
}

// Initial load
loadTimer();

// Admin login
document.getElementById("admin-login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("admin-passcode").value.trim();
  const loginMsg = document.getElementById("login-message");
  if (input === ADMIN_PASSCODE) {
    document.getElementById("admin-section").classList.remove("hidden");
    loginMsg.textContent = "Logged in.";
    loginMsg.style.color = "green";
  } else {
    loginMsg.textContent = "Incorrect passcode.";
    loginMsg.style.color = "red";
  }
});

// Update timer button
document.getElementById("update-timer-btn").addEventListener("click", () => {
  const input = document.getElementById("new-datetime").value;
  const msg = document.getElementById("admin-message");

  if (!input) {
    msg.textContent = "Please select a date/time.";
    msg.style.color = "red";
    return;
  }

  const newDate = new Date(input);
  if (isNaN(newDate)) {
    msg.textContent = "Invalid date/time.";
    msg.style.color = "red";
    return;
  }

  localStorage.setItem("drawingTime", newDate.toISOString());
  msg.textContent = "Timer updated successfully!";
  msg.style.color = "green";

  updateCountdownDisplay(newDate);
});

// End timer button
document.getElementById("end-timer-btn").addEventListener("click", () => {
  localStorage.removeItem("drawingTime");

  const countdownEl = document.getElementById("countdown");
  if (countdownEl) countdownEl.textContent = "Drawing has ended.";

  setButtonEnabled(false);

  if (countdownInterval) clearInterval(countdownInterval);

  const msg = document.getElementById("admin-message");
  msg.textContent = "Timer manually ended.";
  msg.style.color = "green";
});
