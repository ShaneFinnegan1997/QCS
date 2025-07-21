import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', function() {
  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyD-giQ4CGXX6F0RIXbAzbp_0vDDomoLo8g",
    authDomain: "qcsweeps-4b994.firebaseapp.com",
    databaseURL: "https://qcsweeps-4b994-default-rtdb.firebaseio.com",
    projectId: "qcsweeps-4b994",
    storageBucket: "qcsweeps-4b994.appspot.com",
    messagingSenderId: "810241609281",
    appId: "1:810241609281:web:63ecd22b6acbee2cf480c0"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const announcementTextElement = document.getElementById('announcement-text');
  const announcementTimestampElement = document.getElementById('announcement-timestamp');

  // Announcement code
  const announcementRef = ref(db, 'announcement');

  onValue(announcementRef, (snapshot) => {
    const announcement = snapshot.val();
    if (announcement && announcement.text) {
      announcementTextElement.textContent = announcement.text;
      announcementTimestampElement.textContent = "Last Updated: " + (new Date(announcement.timestamp)).toLocaleString();
    } else {
      announcementTextElement.textContent = 'No announcement currently.';
      announcementTimestampElement.textContent = "";
    }
  });
});
