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
  const entryLinkInput = document.getElementById("entry-link");
  const adminMessage = document.getElementById("admin-message");
  const adminLogoutBtn = document.getElementById("admin-logout-btn");

  const ADMIN_PASSCODE = "1234";

  function updateCountdown() {
    const targetTime = localStorage.getItem("countdownTarget");
    const entryLink = localStorage.getItem("entryLink");
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
        if (entryLink) enterButton.onclick = () => window.location.href = entryLink;
      } else {
        countdownElement.innerHTML = "Drawing Closed";
        enterButton.textContent = "Not Available";
        enterButton.disabled = true;
        enterButton.classList.add("disabled");
        enterButton.removeAttribute("onclick");
      }
    } else {
      countdownElement.innerHTML = "Not Available";
      enterButton.textContent = "Not Available";
      enterButton.disabled = true;
      enterButton.classList.add("disabled");
      enterButton.removeAttribute("onclick");
    }
  }

  // Run countdown every second
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Admin logic
  function showAdminPanel() {
    adminSection.classList.remove("hidden");
    adminLoginForm.classList.add("hidden");

    // Pre-fill stored values
    const savedTarget = localStorage.getItem("countdownTarget");
    const savedLink = localStorage.getItem("entryLink");
    if (savedTarget) newDatetimeInput.value = savedTarget;
    if (savedLink) entryLinkInput.value = savedLink;
  }

  function hideAdminPanel() {
    adminSection.classList.add("hidden");
    adminLoginForm.classList.remove("hidden");
  }

  if (adminLoginForm && adminSection) {
    if (localStorage.getItem("isAdmin") === "true") {
      showAdminPanel();
    } else {
      hideAdminPanel();
    }

    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = adminPasscodeInput.value.trim();
      if (entered === ADMIN_PASSCODE) {
        localStorage.setItem("isAdmin", "true");
        showAdminPanel();
        loginMessage.textContent = "";
      } else {
        loginMessage.textContent = "Incorrect passcode.";
      }
    });

    adminLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isAdmin");
      hideAdminPanel();
    });

    updateTimerBtn.addEventListener("click", () => {
      const newTime = newDatetimeInput.value;
      const newLink = entryLinkInput.value.trim();

      if (newTime && newLink) {
        localStorage.setItem("countdownTarget", newTime);
        localStorage.setItem("entryLink", newLink);
        adminMessage.textContent = "Timer and link updated!";
      } else {
        adminMessage.textContent = "Please enter both date/time and link.";
      }
    });

    endTimerBtn.addEventListener("click", () => {
      localStorage.removeItem("countdownTarget");
      localStorage.removeItem("entryLink");
      adminMessage.textContent = "Timer ended!";
    });
  }
});