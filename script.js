const passcode = "secret123"; // Change this!

let countdownInterval = null;

function updateCountdownDisplay(targetDate) {
  const countdownEl = document.getElementById("countdown");
  const enterButton = document.getElementById("enter-button");

  if (countdownInterval) clearInterval(countdownInterval); // Clear previous interval

  function update() {
    const now = new Date();
    const distance = targetDate - now;

    if (distance <= 0) {
      countdownEl.textContent = "Drawing has ended!";
      enterButton.classList.add("disabled");
      enterButton.textContent = "Not Available";
      enterButton.setAttribute("aria-disabled", "true");
      enterButton.style.pointerEvents = "none";
      if (countdownInterval) clearInterval(countdownInterval); // Stop updating
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    enterButton.classList.remove("disabled");
    enterButton.textContent = "Enter Now";
    enterButton.setAttribute("aria-disabled", "false");
    enterButton.style.pointerEvents = "auto";
  }

  update(); // Call once immediately
  countdownInterval = setInterval(update, 1000); // Then update every second
}

// Load timer from localStorage on page load
const savedTime = localStorage.getItem("drawingTime");
if (savedTime) {
  const targetDate = new Date(savedTime);
  if (!isNaN(targetDate)) {
    updateCountdownDisplay(targetDate);
  }
}

// Admin login handler
document.getElementById("admin-login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("admin-passcode").value;
  const loginMsg = document.getElementById("login-message");
  if (input === passcode) {
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
  const enterButton = document.getElementById("enter-button");

  countdownEl.textContent = "Drawing has ended!";
  enterButton.classList.add("disabled");
  enterButton.textContent = "Not Available";
  enterButton.setAttribute("aria-disabled", "true");
  enterButton.style.pointerEvents = "none";

  if (countdownInterval) clearInterval(countdownInterval); // Stop countdown updates

  const msg = document.getElementById("admin-message");
  msg.textContent = "Timer manually ended.";
  msg.style.color = "green";
});
