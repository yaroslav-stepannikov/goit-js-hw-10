import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector(`#datetime-picker`);
const daysEl = document.querySelector(`[data-days]`);
const hoursEl = document.querySelector(`[data-hours]`);
const minutesEl = document.querySelector(`[data-minutes]`);
const secondsEl = document.querySelector(`[data-seconds]`);

startBtn.disabled = true;
let userSelectedDate = null;
let timerInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      startBtn.disabled = true;
      userSelectedDate = null;
      iziToast.error({
        title: `error`,
        message: `Please choose a date in the future`,
        position: `topRight`,
        timeout: 3000,
      });
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
};

flatpickr(dateInput, options);

startBtn.addEventListener(`click`, handlerClick);

function handlerClick(event) {
  if (!userSelectedDate) {
    return;
  }

  startBtn.disabled = true;
  dateInput.disabled = true;

  timerInterval = setInterval(() => {
    const now = new Date();
    const delta = userSelectedDate - now;

    if (delta <= 0) {
      clearInterval(timerInterval);

      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      dateInput.disabled = false;
      startBtn.disabled = true;
      iziToast.success({
        title: `Time is up`,
        message: `Countdown finished`,
        position: `topRight`,
        timeout: 3000,
      });
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(delta);

    daysEl.textContent = String(days).padStart(2, `0`);
    hoursEl.textContent = String(hours).padStart(2, `0`);
    minutesEl.textContent = String(minutes).padStart(2, `0`);
    secondsEl.textContent = String(seconds).padStart(2, `0`);
  }, 1000);
}
