document.addEventListener("DOMContentLoaded", () => {
  const countdownElement = document.getElementById("countdown");
  const enterButton = document.getElementById("enter-button");

  const adminLoginForm = document.getElementById("admin-login-form");
  const adminPasscodeInput = document.getElementById("admin-passcode");
  const loginMessage = document.getElementById("login-message");
  const adminSection = document.getElementById("admin-section");
  const updateTimerBtn = document.getElementById("update-timer-btn");
  const endTimerBtn = document.getElementById("end-timer-btn");
  const newDatetimeInput = document.getElementById("new-datetime");
  const adminMessage = document.getElementById("admin-message");

  const ADMIN_PASSCODE = "1234";

  function updateCountdown() {
    const targetTime = localStorage.getItem("countdownTarget");
    const now = new Date().getTime();

    if (targetTime) {
      const distance = new Date(targetTime).getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        enterButton.textContent = "Enter Now";
        enterButton.disabled = false;
        enterButton.classList.remove("disabled");
      } else {
        countdownElement.innerHTML = "Drawing Closed";
        enterButton.textContent = "Not Available";
        enterButton.disabled = true;
        enterButton.classList.add("disabled");
      }
    } else {
      countdownElement.innerHTML = "Not Available";
      enterButton.textContent = "Not Available";
      enterButton.disabled = true;
      enterButton.classList.add("disabled");
    }
  }

  // Run countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Admin-only page logic
  if (adminLoginForm && adminSection) {
    // Check login state on load
    if (localStorage.getItem("isAdmin") === "true") {
      adminSection.classList.remove("hidden");
      adminLoginForm.classList.add("hidden");
    } else {
      adminSection.classList.add("hidden");
    }

    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = adminPasscodeInput.value.trim();
      if (entered === ADMIN_PASSCODE) {
        localStorage.setItem("isAdmin", "true");
        adminSection.classList.remove("hidden");
        adminLoginForm.classList.add("hidden");
        loginMessage.textContent = "";
      } else {
        loginMessage.textContent = "Incorrect passcode.";
      }
    });

    updateTimerBtn.addEventListener("click", () => {
      const newTime = newDatetimeInput.value;
      if (newTime) {
        localStorage.setItem("countdownTarget", newTime);
        adminMessage.textContent = "Timer updated!";
      } else {
        adminMessage.textContent = "Please select a date and time.";
      }
    });

    endTimerBtn.addEventListener("click", () => {
      localStorage.removeItem("countdownTarget");
      adminMessage.textContent = "Timer ended!";
    });
  }
});