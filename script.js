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

////////////////
//// DESKTOP PET
////////////////


// function createPetWindow() {
//     if (petWindow) {
//         petWindow.focus()
//         return
//     }

//     petWindow = new BrowserWindow({
//         width: 200,
//         height: 200,
//         frame: false, // No window frame
//         transparent: true, // Transparent background
//         alwaysOnTop: true, // Always stay on top
//         resizable: false,
//         skipTaskbar: true, // Don't show in taskbar
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false
//         }
//     })

//     petWindow.loadFile('pet.html')

//     // Start pet in center of screen
//     const { screen } = require('electron')
//     const primaryDisplay = screen.getPrimaryDisplay()
//     const { width, height } = primaryDisplay.workAreaSize

//     petWindow.setPosition(
//         Math.floor(width / 2 - 100),
//         Math.floor(height / 2 - 100)
//     )

//     // Handle pet window closing
//     petWindow.on('closed', () => {
//         petWindow = null
//     })

//     // Make window draggable
//     petWindow.setIgnoreMouseEvents(false)
// }

// // IPC handlers for pet communication
// ipcMain.handle('create-pet', () => {
//     createPetWindow()
// })

// ipcMain.handle('close-pet', () => {
//     if (petWindow) {
//         petWindow.close()
//     }
// })

// ipcMain.handle('show-notification', (event, title, body) => {
//     new Notification({
//         title: title,
//         body: body
//     }).show()
// })

// ipcMain.handle('move-pet', (event, x, y) => {
//     if (petWindow) {
//         petWindow.setPosition(x, y)
//     }
// })

// app.whenReady().then(createWindow)

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// })

// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow()
//     }
// })

// const { ipcRenderer } = require('electron')
// const pet = document.getElementById('pet')
// const contextMenu = document.getElementById('contextMenu')

// let isDragging = false
// let currentX = 0
// let currentY = 0
// let initialX = 0
// let initialY = 0
// let happiness = 50
// let hunger = 30
// let energy = 70

// // Pet states and messages
// const messages = {
//     happy: ["I'm so happy! 😊", "Thanks for playing! 🎉", "You're the best! ⭐"],
//     hungry: ["I'm getting hungry... 🍽️", "Got any snacks? 🍪", "Feed me please! 🥺"],
//     tired: ["I'm sleepy... 😴", "Time for a nap? 💤", "Yawn... 🥱"],
//     bored: ["I'm bored... 😐", "Let's play! 🎮", "Entertain me! 🎭"],
//     excited: ["Woohoo! 🎊", "This is fun! 😄", "More! More! 🤩"]
// }

// // Initialize pet behavior
// function initPet() {
//     // Random messages every 30 seconds
//     setInterval(() => {
//         if (Math.random() < 0.3) {
//             showRandomMessage()
//         }
//     }, 30000)

//     // Update pet needs every minute
//     setInterval(() => {
//         updatePetNeeds()
//     }, 60000)

//     // Occasional random bounce
//     setInterval(() => {
//         if (Math.random() < 0.2) {
//             pet.classList.add('bounce')
//             setTimeout(() => pet.classList.remove('bounce'), 600)
//         }
//     }, 15000)

//     // Welcome message
//     setTimeout(() => {
//         showMessage("I'm your study buddy! 🎓")
//     }, 1000)
// }

// function showMessage(text) {
//     speechBubble.textContent = text
//     speechBubble.classList.add('show')
//     setTimeout(() => {
//         speechBubble.classList.remove('show')
//     }, 3000)
// }

// function showRandomMessage() {
//     let category = 'bored'
//     if (happiness > 70) category = 'happy'
//     else if (hunger > 70) category = 'hungry'
//     else if (energy < 30) category = 'tired'

//     const categoryMessages = messages[category]
//     const randomMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
//     showMessage(randomMessage)
// }

// function updatePetNeeds() {
//     hunger = Math.min(100, hunger + Math.random() * 10)
//     energy = Math.max(0, energy - Math.random() * 5)

//     if (hunger > 80) {
//         happiness = Math.max(0, happiness - 5)
//     }
//     if (energy < 20) {
//         happiness = Math.max(0, happiness - 3)
//     }
// }

// // Dragging functionality
// pet.addEventListener('mousedown', (e) => {
//     if (e.button === 0) { // Left click
//         isDragging = true
//         pet.classList.remove('idle')

//         initialX = e.clientX - currentX
//         initialY = e.clientY - currentY
//     }
// })

// document.addEventListener('mousemove', (e) => {
//     if (isDragging) {
//         e.preventDefault()
//         currentX = e.clientX - initialX
//         currentY = e.clientY - initialY

//         const { screen } = require('electron').remote || require('@electron/remote')
//         const bounds = screen.getPrimaryDisplay().bounds

//         // Keep pet on screen
//         currentX = Math.max(0, Math.min(bounds.width - 200, currentX))
//         currentY = Math.max(0, Math.min(bounds.height - 200, currentY))

//         ipcRenderer.invoke('move-pet', currentX, currentY)
//     }
// })

// document.addEventListener('mouseup', () => {
//     if (isDragging) {
//         isDragging = false
//         pet.classList.add('idle')
//         pet.classList.add('bounce')
//         setTimeout(() => pet.classList.remove('bounce'), 600)
//     }
// })

// // Right click context menu
// pet.addEventListener('contextmenu', (e) => {
//     e.preventDefault()
//     contextMenu.style.left = e.clientX + 'px'
//     contextMenu.style.top = e.clientY + 'px'
//     contextMenu.classList.add('show')
// })

// // Hide context menu when clicking elsewhere
// document.addEventListener('click', (e) => {
//     if (!contextMenu.contains(e.target) && e.target !== pet) {
//         contextMenu.classList.remove('show')
//     }
// })

// // Pet interactions
// function feedPet() {
//     hunger = Math.max(0, hunger - 30)
//     happiness = Math.min(100, happiness + 15)
//     pet.classList.add('happy')
//     showMessage("Yummy! Thanks! 😋")
//     setTimeout(() => pet.classList.remove('happy'), 500)
//     contextMenu.classList.remove('show')

//     ipcRenderer.invoke('show-notification', 'Platypooh Fed!', 'Your pet is happier now! 🍎')
// }

// function playWithPet() {
//     energy = Math.max(0, energy - 20)
//     happiness = Math.min(100, happiness + 20)
//     pet.classList.add('bounce')
//     setTimeout(() => {
//         pet.classList.remove('bounce')
//         pet.classList.add('happy')
//         setTimeout(() => pet.classList.remove('happy'), 500)
//     }, 600)
//     showMessage(messages.excited[Math.floor(Math.random() * messages.excited.length)])
//     contextMenu.classList.remove('show')

//     ipcRenderer.invoke('show-notification', 'Playtime!', 'Your pet had fun playing! 🎾')
// }

// function petPet() {
//     happiness = Math.min(100, happiness + 10)
//     pet.classList.add('happy')
//     showMessage("That feels nice! ❤️")
//     setTimeout(() => pet.classList.remove('happy'), 500)
//     contextMenu.classList.remove('show')

//     ipcRenderer.invoke('show-notification', 'Pet Love!', 'Your pet feels loved! ❤️')
// }

// function closePet() {
//     showMessage("Bye bye! 👋")
//     setTimeout(() => {
//         ipcRenderer.invoke('close-pet')
//     }, 1000)
// }

// let lastX = 0
// let direction = 'right' // Track current direction

// // In your mousemove event listener, add direction detection:
// document.addEventListener('mousemove', (e) => {
//     if (isDragging) {
//         e.preventDefault()

//         // Detect direction based on movement
//         if (e.clientX < lastX && direction !== 'left') {
//             direction = 'left'
//             pet.className = 'pet facing-left idle'
//         } else if (e.clientX > lastX && direction !== 'right') {
//             direction = 'right'
//             pet.className = 'pet facing-right idle'
//         }

//         lastX = e.clientX

//         currentX = e.clientX - initialX
//         currentY = e.clientY - initialY

//         const { screen } = require('electron').remote || require('@electron/remote')
//         const bounds = screen.getPrimaryDisplay().bounds

//         currentX = Math.max(0, Math.min(bounds.width - 200, currentX))
//         currentY = Math.max(0, Math.min(bounds.height - 200, currentY))

//         ipcRenderer.invoke('move-pet', currentX, currentY)
//     }
// })
// setInterval(() => {
//     if (!isDragging && Math.random() < 0.3) {
//         direction = direction === 'left' ? 'right' : 'left'
//         pet.className = `pet facing-${direction} idle`
//     }
// }, 10000)

// // Initialize when page loads
// window.addEventListener('DOMContentLoaded', initPet)
