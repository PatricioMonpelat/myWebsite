let countdown;
let currentSecondTens = 0;
let currentSecondOnes = 0;

function startTimer() {
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const timerDisplay = document.getElementById('timer');

    let totalSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);

    countdown = setInterval(function () {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        updateTimerDisplay(minutes, seconds);

        if (totalSeconds <= 0) {
            clearInterval(countdown);
            alert('Time is up!');
        } else {
            totalSeconds--;
        }
    }, 1000);
}

function updateTimerDisplay(minutes, seconds) {
    const minuteTens = document.getElementById('minuteTens');
    const minuteOnes = document.getElementById('minuteOnes');
    const secondTens = document.getElementById('secondTens');
    const secondOnes = document.getElementById('secondOnes');

    minuteTens.innerText = String(Math.floor(minutes / 10));
    minuteOnes.innerText = String(minutes % 10);

    const newSecondTens = Math.floor(seconds / 10);
    const newSecondOnes = seconds % 10;

    // Update both secondTens and secondOnes together
    if (newSecondTens !== currentSecondTens) {
        updateFlipCard(secondTens, newSecondTens);
        currentSecondTens = newSecondTens;
    }

    // Only update secondOnes if it's different
    if (newSecondOnes !== currentSecondOnes) {
        updateFlipCard(secondOnes, newSecondOnes);
        currentSecondOnes = newSecondOnes;
    }
}

function updateFlipCard(element, value) {
    const front = element.querySelector('.front');
    const back = element.querySelector('.back');

    back.innerText = String(value);

    // Trigger the flip animation
    element.classList.add('flip');
    setTimeout(() => {
        element.classList.remove('flip');
    }, 500);
}

function resetTimer() {
    clearInterval(countdown);
    document.getElementById('minuteTens').value = 0;
    document.getElementById('minuteOnes').value = 0;
    document.getElementById('secondTens').value = 0;
    document.getElementById('secondOnes').value = 0;
    updateTimerDisplay(0, 0);
}