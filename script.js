// ✅ Unified Script for index.html and admin.html

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("admin.html")) {
    initAdminPanel();
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// 🔐 Hashed passcode (do NOT store plain passcode)
// Original passcode: "1234"
const ADMIN_PASSCODE_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"; // SHA-256 of "1234"

// ⏱ Countdown Logic for index.html
function updateCountdown() {
  const countdownElement = document.getElementById("countdown");
  const enterButton = document.getElementById("enter-button");

  if (!countdownElement || !enterButton) return;

  firebase.database().ref("/settings").on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      countdownElement.innerHTML = "No events currently scheduled.";
      enterButton.textContent = "Not Available";
      enterButton.disabled = true;
      return;
    }

    const targetTime = new Date(data.countdownTarget).getTime();
    const entryLink = data.entryLink;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        enterButton.textContent = "Enter Now";
        enterButton.disabled = false;
        enterButton.classList.remove("disabled");
        enterButton.onclick = () => window.location.href = entryLink;
      } else {
        countdownElement.innerHTML = "Drawing Closed";
        enterButton.textContent = "Not Available";
        enterButton.disabled = true;
        clearInterval(interval);
      }
    }, 1000);
  });
}

// 🛠 Admin Panel Logic for admin.html
function initAdminPanel() {
  const loginForm = document.getElementById("admin-login-form");
  const passInput = document.getElementById("admin-passcode");
  const loginMsg = document.getElementById("login-message");

  const adminSection = document.getElementById("admin-section");
  const updateBtn = document.getElementById("update-timer-btn");
  const endBtn = document.getElementById("end-timer-btn");
  const datetimeInput = document.getElementById("new-datetime");
  const linkInput = document.getElementById("entry-link");
  const msg = document.getElementById("admin-message");
  const logoutBtn = document.getElementById("admin-logout-btn");

  if (!loginForm || !adminSection) return;

  // Show/hide admin
  function showAdminPanel() {
    loginForm.classList.add("hidden");
    adminSection.classList.remove("hidden");

    const savedTime = localStorage.getItem("countdownTarget");
    const savedLink = localStorage.getItem("entryLink");

    if (savedTime) {
      const localTime = new Date(savedTime).toISOString().slice(0, 16);
      datetimeInput.value = localTime;
    }
    if (savedLink) linkInput.value = savedLink;
  }

  function hideAdminPanel() {
    loginForm.classList.remove("hidden");
    adminSection.classList.add("hidden");
  }

  // Login if already authenticated
  if (localStorage.getItem("isAdmin") === "true") {
    showAdminPanel();
  } else {
    hideAdminPanel();
  }

  // Login handler
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const entered = passInput.value.trim();
    const hash = await hashText(entered);
    if (hash === ADMIN_PASSCODE_HASH) {
      localStorage.setItem("isAdmin", "true");
      showAdminPanel();
      loginMsg.innerText = "";
    } else {
      loginMsg.innerText = "Incorrect passcode.";
    }
  });

  // Logout handler
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isAdmin");
    hideAdminPanel();
    window.location.href = "index.html";
  });

  // Update timer
  updateBtn.addEventListener("click", () => {
    const time = datetimeInput.value;
    const link = linkInput.value.trim();

    if (!time || !link) {
      msg.innerText = "Please enter both date/time and link.";
      return;
    }

    const utcTime = new Date(time).toISOString();
    localStorage.setItem("countdownTarget", utcTime);
    localStorage.setItem("entryLink", link);
    msg.innerText = "Timer and link updated!";
  });

  // End timer
  endBtn.addEventListener("click", () => {
    localStorage.removeItem("countdownTarget");
    localStorage.removeItem("entryLink");
    msg.innerText = "Timer ended.";
  });
}

// 🔐 Hash function for passcode
async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}