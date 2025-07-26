////////////
// STUDY SESSION FUNCTIONALITY
////////////
let timeRemaining = 25 * 60; // 25 minutes in seconds
let totalTime = 25 * 60;
let isRunning = false; // Changed to false initially
let isPaused = false;
let timerInterval;
let sessionCount = 0;
let isBreakTime = false;

let currentDirection = 'right';
let animationInterval;
let speechInterval;

const platyImg = document.getElementById('platyImg');
const speechBubble = document.getElementById('speechBubble');

// Speech messages for different situations
const messages = {
    focus: [
        "You've got this! 💪",
        "Stay focused! 🎯",
        "Great job studying! ⭐",
        "Keep going! 📚",
        "You're doing amazing! 🌟",
        "Focus mode activated! 🚀"
    ],
    break: [
        "Time for a break! ☕",
        "Stretch those legs! 🚶‍♀️",
        "Rest up! 😌",
        "Great work! 🎉",
        "Recharge time! 🔋"
    ],
    motivation: [
        "You're a study superstar! ⭐",
        "Knowledge is power! 💡",
        "Every minute counts! ⏰",
        "Stay strong! 💪",
        "Learning is fun! 🎓"
    ],
    milestone: [
        "10 minutes down! 🎯",
        "Halfway there! 🏃‍♀️",
        "5 minutes left! 💨",
        "Almost done! 🏁"
    ]
};

// Start timer immediately when page loads
window.onload = function () {
    console.log('Page loaded, starting timer...'); // Debug log
    updateDisplay(); // Show initial time
    updateProgress(); // Show initial progress
    startTimer();
    startPlatyAnimation();
    startSpeechBubbles();
};

function startTimer() {
    console.log('Starting timer...'); // Debug log
    isRunning = true; // Set running to true when starting

    timerInterval = setInterval(function () {
        if (!isPaused && isRunning) {
            timeRemaining--;
            updateDisplay();
            updateProgress();
            checkMilestones(); // Added this call that was missing

            if (timeRemaining <= 0) {
                timerComplete();
            }
        }
    }, 1000);
}

function startPlatyAnimation() {
    // Check if platyImg exists before starting animation
    if (!platyImg) {
        console.warn('platyImg element not found');
        return;
    }

    // Switch between left and right images every 3-5 seconds
    animationInterval = setInterval(() => {
        if (!isPaused) {
            currentDirection = currentDirection === 'right' ? 'left' : 'right';
            platyImg.style.backgroundImage = `url('platy-${currentDirection}.png')`;

            // Add bounce effect when switching
            platyImg.classList.add('bounce');
            setTimeout(() => platyImg.classList.remove('bounce'), 600);
        }
    }, Math.random() * 2000 + 3000); // Random between 3-5 seconds
}

function startSpeechBubbles() {
    // Check if speechBubble exists before starting
    if (!speechBubble) {
        console.warn('speechBubble element not found');
        return;
    }

    // Show speech bubbles every 20-40 seconds
    speechInterval = setInterval(() => {
        if (!isPaused && isRunning) {
            showRandomMessage();
        }
    }, Math.random() * 20000 + 20000); // Random between 20-40 seconds
}

function showRandomMessage() {
    let messageArray = isBreakTime ? messages.break : messages.focus;

    // Add some motivation messages randomly
    if (Math.random() < 0.3) {
        messageArray = messages.motivation;
    }

    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    showSpeechBubble(randomMessage);
}

function showSpeechBubble(text) {
    if (!speechBubble) return; // Safety check

    speechBubble.textContent = text;
    speechBubble.classList.add('show');

    // Add wiggle animation to platy when talking
    if (platyImg) {
        platyImg.classList.add('wiggle');
    }

    setTimeout(() => {
        speechBubble.classList.remove('show');
        if (platyImg) {
            platyImg.classList.remove('wiggle');
        }
    }, 3000);
}

function checkMilestones() {
    const elapsed = totalTime - timeRemaining;
    const minutes = Math.floor(elapsed / 60);

    // Show milestone messages
    if (elapsed === 10 * 60) { // 10 minutes
        showSpeechBubble(messages.milestone[0]);
    } else if (elapsed === Math.floor(totalTime / 2)) { // Halfway
        showSpeechBubble(messages.milestone[1]);
    } else if (timeRemaining === 5 * 60) { // 5 minutes left
        showSpeechBubble(messages.milestone[2]);
    } else if (timeRemaining === 1 * 60) { // 1 minute left
        showSpeechBubble(messages.milestone[3]);
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = display;
    } else {
        console.warn('timerDisplay element not found');
    }
}

function updateProgress() {
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    } else {
        console.warn('progressFill element not found');
    }
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');

    if (pauseBtn) {
        if (isPaused) {
            pauseBtn.textContent = 'Resume';
            pauseBtn.style.backgroundColor = '#f39c12';
        } else {
            pauseBtn.textContent = 'Pause';
            pauseBtn.style.backgroundColor = '#dddddd';
        }
    }
}

function endTimer() {
    clearInterval(timerInterval);
    clearInterval(animationInterval);
    clearInterval(speechInterval);
    isRunning = false;

    // Show completion message
    if (confirm('Great job studying! Ready to go back to the homepage?')) {
        window.location.href = 'index.html';
    }
}

function timerComplete() {
    clearInterval(timerInterval);

    if (!isBreakTime) {
        // Focus session completed
        sessionCount++;
        const sessionCountElement = document.getElementById('sessionCount');
        if (sessionCountElement) {
            sessionCountElement.textContent = sessionCount;
        }

        // Start break time
        isBreakTime = true;
        timeRemaining = 5 * 60; // 5 minute break
        totalTime = 5 * 60;

        const timerStatus = document.getElementById('timerStatus');
        const timerDisplay = document.getElementById('timerDisplay');
        const progressFill = document.getElementById('progressFill');

        if (timerStatus) timerStatus.textContent = 'Break Time!';
        if (timerDisplay) timerDisplay.style.color = '#27ae60';
        if (progressFill) progressFill.style.backgroundColor = '#27ae60';

        alert('🎉 Focus session complete! Time for a 5-minute break!');
        startTimer();

    } else {
        // Break completed
        isBreakTime = false;
        timeRemaining = 25 * 60; // Back to 25 minutes
        totalTime = 25 * 60;

        const timerStatus = document.getElementById('timerStatus');
        const timerDisplay = document.getElementById('timerDisplay');
        const progressFill = document.getElementById('progressFill');

        if (timerStatus) timerStatus.textContent = 'Focus Time';
        if (timerDisplay) timerDisplay.style.color = '#e74c3c';
        if (progressFill) progressFill.style.backgroundColor = '#e74c3c';

        alert('Break time over! Ready for another focus session?');
        startTimer();
    }

    // Reset progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    updateDisplay();
}

// Prevent accidental page refresh
window.addEventListener('beforeunload', function (e) {
    if (isRunning && timeRemaining > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});
