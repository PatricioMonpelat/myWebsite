let countdown;
    
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
    secondTens.innerText = String(Math.floor(seconds / 10));
    secondOnes.innerText = String(seconds % 10);

    // Apply flicker effect to each timer card
    flickerEffect([minuteTens, minuteOnes, secondTens, secondOnes]);
}

function flickerEffect(elements) {
    elements.forEach(element => {
        element.classList.add('flicker');
        setTimeout(() => {
            element.classList.remove('flicker');
        }, 100);
    });
}

function resetTimer() {
    clearInterval(countdown);
    document.getElementById('minutes').value = 0;
    document.getElementById('seconds').value = 0;
    updateTimerDisplay(0, 0);
}