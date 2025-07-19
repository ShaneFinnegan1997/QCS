// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-giQ4CGXX6F0RIXbAzbp_0vDDomoLo8g",
  authDomain: "qcsweeps-4b994.firebaseapp.com",
  databaseURL: "https://qcsweeps-4b994-default-rtdb.firebaseio.com",
  projectId: "qcsweeps-4b994",
  storageBucket: "qcsweeps-4b994.appspot.com",
  messagingSenderId: "810241609281",
  appId: "1:810241609281:web:63ecd22b6acbee2cf480c0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Admin Panel Logic
function checkPasscode() {
  const passcode = document.getElementById("admin-passcode").value;
  const correctPass = "letmein"; // CHANGE THIS TO A SECURE PASSWORD

  if (passcode === correctPass) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-controls").style.display = "block";
  } else {
    document.getElementById("login-error").innerText = "Incorrect passcode.";
  }
}

function updateCountdown() {
  const datetime = document.getElementById("new-datetime").value;
  const entryLink = document.getElementById("entry-link").value;

  if (!datetime || !entryLink) {
    alert("Please fill out all fields.");
    return;
  }

  const targetTime = new Date(datetime).toISOString();
  db.ref("countdown").set({ targetTime, entryLink })
    .then(() => alert("Countdown updated!"))
    .catch((error) => console.error("Error updating: ", error));
}


---

✅ Next Steps:

Upload both admin.html and script.js to your GitHub repo.

Visit admin.html and enter the passcode letmein (you can change this securely later).

Input a date/time and link → it will sync to Firebase and reflect on your index page automatically!


Want the events.html next to display a log or history? Let me know!

