const passcode = "secret123"; // Change this to your desired admin passcode

// Countdown timer setup
function updateCountdownDisplay(targetDate) {
  const countdownEl = document.getElementById('countdown');
  const enterButton = document.getElementById('enter-button');

  function update() {
    const now = new Date();
    const distance = targetDate - now;

    if (distance <= 0) {
      countdownEl.textContent = "Drawing has ended!";
      enterButton.classList.add('disabled');
      enterButton.textContent = "Not Available";
      enterButton.setAttribute('aria-disabled', 'true');
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // Enable button if time is in the future
    enterButton.classList.remove('disabled');
    enterButton.textContent = "Enter Now";
    enterButton.setAttribute('aria-disabled', 'false');
  }

  update(); // run once
  setInterval(update, 1000); // update every second
}

// Load countdown from storage
const savedTime = localStorage.getItem('drawingTime');
if (savedTime) {
  const targetDate = new Date(savedTime);
  if (!isNaN(targetDate)) {
    updateCountdownDisplay(targetDate);
  }
}

// Admin login
document.getElementById('admin-login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('admin-passcode').value;
  const loginMsg = document.getElementById('login-message');
  if (input === passcode) {
    document.getElementById('admin-section').classList.remove('hidden');
    loginMsg.textContent = "Logged in.";
  } else {
    loginMsg.textContent = "Incorrect passcode.";
  }
});

// Set new timer
document.getElementById('update-timer-btn').addEventListener('click', () => {
  const input = document.getElementById('new-datetime').value;
  const msg = document.getElementById('admin-message');

  if (!input) {
    msg.textContent = "Please select a date/time.";
    return;
  }

  const newDate = new Date(input);
  if (isNaN(newDate)) {
    msg.textContent = "Invalid date/time.";
    return;
  }

  localStorage.setItem('drawingTime', newDate.toISOString());
  msg.textContent = "Timer updated successfully!";
  updateCountdownDisplay(newDate);
});

// End the timer manually
document.getElementById('end-timer-btn').addEventListener('click', () => {
  localStorage.removeItem('drawingTime');

  const countdownEl = document.getElementById('countdown');
  const enterButton = document.getElementById('enter-button');

  if (countdownEl) countdownEl.textContent = "Drawing has ended!";
  if (enterButton) {
    enterButton.classList.add('disabled');
    enterButton.textContent = "Not Available";
    enterButton.setAttribute('aria-disabled', 'true');
  }

  const msg = document.getElementById('admin-message');
  msg.textContent = "Timer manually ended.";
});
