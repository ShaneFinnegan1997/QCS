import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getDatabase,
ref,
set,
get,
push,
onValue,
remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
getAuth,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; // Import Firebase Auth

document.addEventListener('DOMContentLoaded', function() {

// Firebase Config
const firebaseConfig = {
@@ -237,3 +238,4 @@
}
}
};
});