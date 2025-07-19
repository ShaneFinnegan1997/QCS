// events-admin.js
// Initialize Firebase
const db = firebase.database();
const eventsRef = db.ref('events');

const eventsAdminSection = document.getElementById('events-admin');
const addEventForm = document.getElementById('add-event-form');
const adminEventsList = document.getElementById('admin-events-list');

function showEventsAdmin() {
    eventsAdminSection.classList.remove('hidden');
    console.log("Setting up Firebase listener for events..."); // <== Add this line
    // Load admin events
    eventsRef.on('value', snapshot => {
        adminEventsList.innerHTML = '';
        const events = snapshot.val();
        if (!events) {
            adminEventsList.innerHTML = '<li>No events yet.</li>';
            return;
        }
        // Sort by date descending
        const arr = Object.entries(events)
            .map(([id, data]) => ({
                id,
                ...data
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
        arr.forEach(event => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>\${event.title}</strong> <br>
                <span>\${event.message}</span> <br>
                <small>\${new Date(event.timestamp).toLocaleString()}</small>
                <button data-id="\${event.id}">Delete</button>
            `;
            adminEventsList.appendChild(li);
            // Add delete handler
            li.querySelector('button').onclick = () => {
                if (confirm("Delete this event?")) {
                    eventsRef.child(event.id).remove();
                }
            };
        });
    });
}

// Add new event
addEventForm.onsubmit = function (e) {
    e.preventDefault();
    const title = document.getElementById('event-title').value.trim();
    const message = document.getElementById('event-message').value.trim();
    if (!title || !message) return;
    const newEventRef = eventsRef.push();
    newEventRef.set({
        title,
        message,
        timestamp: Date.now()
    }).then(() => { // <== Add this .then() block
        console.log("Event saved to Firebase!", title, message);
        addEventForm.reset();
    }).catch(error => {
        console.error("Error saving event:", error);
    });
};
