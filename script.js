// Countdown to a fixed date
const countdown = document.getElementById('countdown');
const targetDate = new Date('2025-08-01T18:00:00').getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    clearInterval(timer);
    countdown.innerHTML = "The drawing is happening now!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  countdown.innerHTML = `${days}d ${hrs}h ${mins}m ${secs}s`;
}, 1000);
