////////////
// STUDY SESSION FUNCTIONALITY
////////////
let timeRemaining; // Will be set from sessionStorage or default
let totalTime; // Will be set from sessionStorage or default
let isRunning = false;
let isPaused = false;
let timerInterval;
let isBreakTime = false;

let currentDirection = 'right';
let animationInterval;
let speechInterval;

const platyImg = document.getElementById('platyImg');
const speechBubble = document.getElementById('speechBubble');

// Speech messages for different situations
const messages = {
    focus: [
        "I need to get out!",
        "Stay focused! PLEASE!",
        "Well done! Keep going...",
        "Go on! ",
        "You're doing so amazing!",
        "Escape mode activated! "
    ],
    break: [
        "Time for a break! ",
        "Stretch those legs! 🚶",
        "Rest up! ",
        "Great work! ",
        "Recharge time! ",
        "You've done really well!",
        "Don't forget to relax!"
    ],
    motivation: [
        "You've got everything down! ",
        "Knowledge is power! ",
        "Every minute counts! ",
        "Stay strong! ",
        "1 step closer to success"
    ],
    milestone: [
        "10 minutes down! ",
        "Halfway there! ",
        "5 minutes left! ",
        "Almost done! :D"
    ],
    xpReward: [
        "Great progress! +5 XP! ",
        "Keep it up! +5 XP! ",
        "Milestone reached! +5 XP! ",
        "Fantastic! +5 XP! "
    ]
};
let selectedMinutes = 25; // Default to 25 minutes

function selectPreset(minutes) {
    selectedMinutes = minutes;
    sessionStorage.setItem('studyTimeMinutes', selectedMinutes); // ADD THIS LINE

    // Update input fields
    document.getElementById('hours').value = Math.floor(minutes / 60);
    document.getElementById('minutes').value = minutes % 60;

    // Update visual selection
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');

    updateSelectedTimeDisplay();
    showPlatyMessage(`${minutes} minutes sounds perfect! 💪`);

    console.log(`Preset selected: ${minutes} minutes`);
}
function startStudySession() {
    // Store the selected time in sessionStorage before navigating
    sessionStorage.setItem('studyTimeMinutes', selectedMinutes);
    console.log(`Storing ${selectedMinutes} minutes in sessionStorage`);

    // Navigate to the study timer page
    window.location.href = './studysession.html';
}

function updateSelectedTimeDisplay() {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;

    selectedMinutes = hours * 60 + minutes;
    sessionStorage.setItem('studyTimeMinutes', selectedMinutes); // ADD THIS LINE

    let timeText = '';
    if (hours > 0) {
        timeText += `${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) {
            timeText += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
    } else {
        timeText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    const selectedTimeElement = document.getElementById('selectedTime');
    if (selectedTimeElement) {
        selectedTimeElement.textContent = timeText;
    }
}


function showPlatyMessage(message) {
    const speechBubble = document.getElementById('speechBubbleCute');
    if (!speechBubble) return;

    speechBubble.textContent = message;
    speechBubble.classList.add('show');

    const platyCute = document.getElementById('platyCute');
    if (platyCute) {
        platyCute.classList.add('wiggle');
    }

    setTimeout(() => {
        speechBubble.classList.remove('show');
        if (platyCute) {
            platyCute.classList.remove('wiggle');
        }
    }, 3000);
}

function initializeStudySession() {
    // Try sessionStorage first
    let customMinutes = sessionStorage.getItem('studyTimeMinutes');

    // Then try URL query parameter as fallback
    if (!customMinutes) {
        const urlParams = new URLSearchParams(window.location.search);
        const timeFromURL = urlParams.get('time');
        if (timeFromURL) {
            customMinutes = timeFromURL;
        }
    }

    // Parse time safely
    const studyMinutes = parseInt(customMinutes);
    const validStudyMinutes = !isNaN(studyMinutes) && studyMinutes > 0 ? studyMinutes : 25;

    console.log(`customMinutes: ${customMinutes}`);
    console.log(`Parsed studyMinutes: ${studyMinutes}`);
    console.log(`Valid final value used: ${validStudyMinutes} minutes`);

    // Set global timer values
    timeRemaining = validStudyMinutes * 60;
    totalTime = validStudyMinutes * 60;

    updateDisplay();
    updateProgress();
    startTimer();
    startPlatyAnimation();
    startSpeechBubbles();
}


function startTimer() {
    console.log('Starting timer...');
    isRunning = true;

    timerInterval = setInterval(function () {
        if (!isPaused && isRunning) {
            timeRemaining--;
            updateDisplay();
            updateProgress();
            checkMilestones();

            if (timeRemaining <= 0) {
                timerComplete();
            }
        }
    }, 1000);
}

function startPlatyAnimation() {
    if (!platyImg) {
        console.warn('platyImg element not found');
        return;
    }

    platyImg.style.backgroundImage = `url('platy-${currentDirection}.png')`;

    animationInterval = setInterval(() => {
        if (!isPaused) {
            currentDirection = currentDirection === 'right' ? 'left' : 'right';
            platyImg.style.backgroundImage = `url('platy-${currentDirection}.png')`;

            platyImg.classList.add('bounce');
            setTimeout(() => platyImg.classList.remove('bounce'), 600);
        }
    }, Math.random() * 2000 + 3000);
}

function startSpeechBubbles() {
    if (!speechBubble) {
        console.warn('speechBubble element not found');
        return;
    }

    speechInterval = setInterval(() => {
        if (!isPaused && isRunning) {
            showRandomMessage();
        }
    }, Math.random() * 20000 + 20000);
}

function showRandomMessage() {
    let messageArray = isBreakTime ? messages.break : messages.focus;

    if (Math.random() < 0.3) {
        messageArray = messages.motivation;
    }

    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    showSpeechBubble(randomMessage);
}

function showSpeechBubble(text) {
    if (!speechBubble) return;

    speechBubble.textContent = text;

    const sides = ['left', 'right', 'top-left', 'top-right'];
    const randomSide = sides[Math.floor(Math.random() * sides.length)];

    speechBubble.classList.remove('left', 'right', 'top-left', 'top-right');
    speechBubble.classList.add(randomSide);
    speechBubble.classList.add('show');

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

    // Award XP at milestones
    if (elapsed === 10 * 60) { // 10 minutes
        showSpeechBubble(messages.xpReward[0]);
        addXP(5);
    } else if (elapsed === Math.floor(totalTime / 2)) { // Halfway
        showSpeechBubble(messages.xpReward[1]);
        addXP(5);
    } else if (timeRemaining === 5 * 60) { // 5 minutes left
        showSpeechBubble(messages.xpReward[2]);
        addXP(5);
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
        console.log(`Display updated to: ${display}`);
    }
}

function updateProgress() {
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
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

    if (confirm('Great job studying! Ready to go back to the homepage?')) {
        // Clear the stored study time
        sessionStorage.removeItem('studyTimeMinutes');
        window.location.href = './index.html';
    }
}

function timerComplete() {
    clearInterval(timerInterval);

    if (!isBreakTime) {
        // Focus session completed - award XP based on session length
        const baseXP = 20;
        const bonusXP = Math.floor(totalTime / 300) * 2; // +2 XP per 5 minutes
        const totalXP = baseXP + bonusXP;

        addXP(totalXP);
        showSpeechBubble(`🎉 Session complete! +${totalXP} XP! 🎉`);

        isBreakTime = true;
        // Break time is 20% of study time, minimum 5 minutes
        const breakMinutes = Math.max(5, Math.floor(totalTime / 300));
        timeRemaining = breakMinutes * 60;
        totalTime = breakMinutes * 60;

        const timerDisplay = document.getElementById('timerDisplay');
        const progressFill = document.getElementById('progressFill');

        if (timerDisplay) timerDisplay.style.color = '#27ae60';
        if (progressFill) progressFill.style.backgroundColor = '#27ae60';

        alert(`🎉 Focus session complete! You earned ${totalXP} XP! Time for a ${breakMinutes}-minute break!`);
        startTimer();

    } else {
        // Break complete - offer to continue or end
        const continueStudy = confirm('Break time over! Ready for another study session?');

        if (continueStudy) {
            // Get original study time from sessionStorage or use 25 minutes default
            const originalMinutes = sessionStorage.getItem('studyTimeMinutes') || 25;
            isBreakTime = false;
            timeRemaining = originalMinutes * 60;
            totalTime = originalMinutes * 60;

            const timerDisplay = document.getElementById('timerDisplay');
            const progressFill = document.getElementById('progressFill');

            if (timerDisplay) timerDisplay.style.color = '#e74c3c';
            if (progressFill) progressFill.style.backgroundColor = '#e74c3c';

            startTimer();
        } else {
            // User chose to end - go back to homepage
            sessionStorage.removeItem('studyTimeMinutes');
            window.location.href = './index.html';
        }
    }

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    updateDisplay();
}

window.addEventListener('beforeunload', function (e) {
    if (isRunning && timeRemaining > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});


// THIS IS THE MISSING PIECE! 
// Initialize different pages based on what elements are present

window.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - checking which page we\'re on...');

    // Initialize XP display FIRST on all pages
    updateXPDisplay();

    // Time selection page
    if (document.getElementById('selectedTime')) {
        console.log('Time selection page detected');
        updateSelectedTimeDisplay();

        // Add event listeners for custom input
        const hoursInput = document.getElementById('hours');
        const minutesInput = document.getElementById('minutes');

        if (hoursInput && minutesInput) {
            hoursInput.addEventListener('input', function () {
                document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('selected'));
                updateSelectedTimeDisplay();
            });

            minutesInput.addEventListener('input', function () {
                document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('selected'));
                updateSelectedTimeDisplay();
            });
        }
    }

    // Study session page
    if (document.getElementById('timerDisplay')) {
        console.log('Study session page detected - initializing timer...');
        initializeStudySession();
    }

    // Homepage - start cute platy animation
    if (document.getElementById('platyCute')) {
        console.log('Homepage detected - starting cute platy animation');
        startCutePlatyAnimation();

        // Ensure XP display is updated for homepage
        setTimeout(() => updateXPDisplay(), 100);
    }

    // Shop page
    if (document.getElementById('shopContainer')) {
        console.log('Shop page detected - initializing shop...');
        updateXPDisplay();
        initializeShop();
    }

    // Story page
    if (document.getElementById('story-image')) {
        console.log('Story page detected - initializing story...');
        initializeStory();
    }

    // Chat page
    if (document.getElementById('chatMessages')) {
        console.log('Chat page detected - initializing chat...');
        window.chatInterface = new ChatInterface();
    }
});

// HOMEPAGE PLATY ANIMATION (for index.html)
let cuteDirection = 'right';
let cuteAnimationInterval;
let cuteSpeechTimeout;

const cuteMessages = [
    "Help me by studying!",
    "Go to 'Story'!",
    "You can do this...",
    "I need you! So study!",
    "Get rich by studying!",
    "Study with me!",
    "Dress me up!",
    "Buy me outfits!",
    "I like you when you study!",
    "Let me out..!",
    "You can pet me later!"
];

function startCutePlatyAnimation() {
    const platyCute = document.getElementById('platyCute');

    if (!platyCute) {
        console.log('platyCute element not found');
        return;
    }

    console.log('Starting cute platy animation');

    // Set initial image
    platyCute.style.backgroundImage = `url('platy-heart-${cuteDirection}.png')`;

    // Start showing speech bubbles
    startDynamicSpeech();
}

function startDynamicSpeech() {
    // Show first message after 3 seconds
    cuteSpeechTimeout = setTimeout(() => {
        showCuteMessage();
        scheduleNextSpeech();
    }, 3000);
}

function scheduleNextSpeech() {
    // Schedule next message between 8-12 seconds
    const nextDelay = Math.random() * 4000 + 8000;

    cuteSpeechTimeout = setTimeout(() => {
        showCuteMessage();
        scheduleNextSpeech();
    }, nextDelay);
}

function showCuteMessage() {
    const speechBubbleCute = document.getElementById('speechBubbleCute');

    if (!speechBubbleCute) {
        console.log('speechBubbleCute element not found');
        return;
    }

    console.log('Showing cute message');

    // Pick random message
    const randomMessage = cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
    speechBubbleCute.textContent = randomMessage;

    // Randomly position the speech bubble on different sides
    const sides = ['right'];
    const randomSide = sides[Math.floor(Math.random() * sides.length)];

    // Remove all existing position classes
    speechBubbleCute.classList.remove('left', 'right', 'top-left', 'top-right');

    // Add the new position class
    speechBubbleCute.classList.add(randomSide);
    speechBubbleCute.classList.add('show');

    // Add wiggle animation to platy when talking
    const platyCute = document.getElementById('platyCute');
    if (platyCute) {
        platyCute.classList.add('wiggle');
    }

    // Hide after 3 seconds
    setTimeout(() => {
        speechBubbleCute.classList.remove('show');
        if (platyCute) {
            platyCute.classList.remove('wiggle');
        }
    }, 3000);
}


// Clean up when leaving page  
window.addEventListener('beforeunload', function () {
    clearInterval(cuteAnimationInterval);
    clearTimeout(cuteSpeechTimeout);
});

////////
//// STORY FUNCTIONALITY
////////

const storySlides = [
    { image: 'baby-platy.png', text: 'Once upon a time, in a not so magical land, there was a baby platypus named Platy.' },
    { image: 'platy-parents.png', text: "Platy's parents we're unhappy with Platy's appearance. Going on to say that Platy was not a 'normal' platypus. :(" },
    { image: 'platy-school.png', text: "Platy went to school, but the other platypuses bullied Platy for being different." },
    { image: 'casino.png', text: "One day when Platy was older he stumbled upon a plasino.. (oh no Platy!)" },
    { image: 'casino-cards.png', text: "Platy started gambling and kept winning! Platy started to go to the plasino more." },
    { image: 'platy-mafia.png', text: "The mafia got wind of this and decided to challenge Platy until he lost all his money and owed them..." },
    { image: 'platy-sewers.png', text: "Platy was so upset and didn't know what to do, so he ran away to a mysterious electrifying sewer..." },
    { image: 'platy-trapped.png', text: "..Where Platy was trapped in a computer powering AI and couldn't get out! He was so distressed and didn't know what to do." },
    { image: 'book.png', text: "The only way to save Platy is by.. STUDYING! Study now and save Platy. :D " },
]

let currentSlide = 0;

function initializeStory() {
    showSlide(0);
}

function showSlide(index) {
    document.getElementById('story-image').src = storySlides[index].image;
    document.getElementById('story-text').textContent = storySlides[index].text;

    // Update button on last slide
    const nextBtn = document.querySelector('button');
    if (index === storySlides.length - 1) {
        nextBtn.textContent = 'Back to Home';
        nextBtn.onclick = () => window.location.href = './index.html';
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.onclick = nextSlide;
    }
}

function nextSlide() {
    if (currentSlide < storySlides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

////////////
// XP SYSTEM
////////////
let userXP = parseInt(localStorage.getItem('userXP')) || 0;

function updateXPDisplay() {
    const xpDisplay = document.getElementById('xpDisplay');
    if (xpDisplay) {
        xpDisplay.textContent = userXP;
    }
}

function addXP(amount) {
    userXP += amount;
    localStorage.setItem('userXP', userXP);
    updateXPDisplay();

    // Show XP gained animation
    showXPGainedMessage(amount);
}

function showXPGainedMessage(amount) {
    // Create floating XP message
    const xpMessage = document.createElement('div');
    xpMessage.textContent = `+${amount} XP!`;
    xpMessage.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #ffd700, #ffed4e);
        color: #333;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 18px;
        z-index: 1000;
        animation: xpFloat 2s ease-out forwards;
        pointer-events: none;
        border: 2px solid #ffc107;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
    `;

    // Add animation keyframes if not already added
    if (!document.getElementById('xpAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'xpAnimationStyles';
        style.textContent = `
            @keyframes xpFloat {
                0% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-50px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(xpMessage);

    // Remove message after animation
    setTimeout(() => {
        if (xpMessage.parentNode) {
            xpMessage.parentNode.removeChild(xpMessage);
        }
    }, 2000);
}

const shopItems = [
    {
        id: 1,
        name: "Pink Platy",
        price: 15,
        image: "pink-platy.png",
        description: "A pink platy! So cute and perfect to study",
        category: "skins"
    },
    {
        id: 2,
        name: "Red Platy",
        price: 25,
        image: "red-platy.png",
        description: "Red Platy to use your rage to study harder!",
        category: "skins"
    },
    {
        id: 3,
        name: "Orange Platy",
        price: 20,
        image: "orange-platy.png",
        description: "Orange Platy to keep you warm while you study!",
        category: "skins"
    },
    {
        id: 4,
        name: "Yellow Platy",
        price: 50,
        image: "yellow-platy.png",
        description: "Yellow Platy to shine bright like a star while you study!",
        category: "skins"
    },
    {
        id: 5,
        name: "Green Platy",
        price: 30,
        image: "green-platy.png",
        description: "Green Platy to feel the breeze of nature while you study!",
        category: "skins"
    },
    {
        id: 6,
        name: "Light Blue Platy",
        price: 30,
        image: "lightblue-platy.png",
        description: "Light Blue Platy to calm your mind and boost focus!",
        category: "skins"
    }
];

let ownedItems = JSON.parse(localStorage.getItem('ownedItems')) || [];

function initializeShop() {
    displayShopItems();
}

function displayShopItems() {
    const shopContainer = document.getElementById('shopContainer');
    if (!shopContainer) return;

    shopContainer.innerHTML = '';

    shopItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='placeholder.png'">
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-price">💰 ${item.price} XP</p>
                ${ownedItems.includes(item.id) ? '<span class="owned-badge">OWNED</span>' : ''}
            </div>
        `;

        itemElement.addEventListener('click', () => openItemModal(item));
        shopContainer.appendChild(itemElement);
    });
}

function openItemModal(item) {
    const modal = document.getElementById('itemModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    const purchaseBtn = document.getElementById('purchaseBtn');

    modalImage.src = item.image;
    modalImage.onerror = () => modalImage.src = 'placeholder.png';
    modalName.textContent = item.name;
    modalDescription.textContent = item.description;
    modalPrice.textContent = `💰 ${item.price} XP`;

    if (ownedItems.includes(item.id)) {
        purchaseBtn.textContent = 'OWNED';
        purchaseBtn.disabled = true;
        purchaseBtn.style.backgroundColor = '#95a5a6';
    } else {
        purchaseBtn.textContent = 'Purchase';
        purchaseBtn.disabled = false;
        purchaseBtn.style.backgroundColor = '#27ae60';
        purchaseBtn.onclick = () => purchaseItem(item);
    }

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
}

function purchaseItem(item) {
    if (userXP >= item.price) {
        userXP -= item.price;
        localStorage.setItem('userXP', userXP);
        ownedItems.push(item.id);
        localStorage.setItem('ownedItems', JSON.stringify(ownedItems));

        updateXPDisplay();
        displayShopItems();
        closeModal();

        alert(`🎉 You purchased ${item.name}! Enjoy your new item!`);
    } else {
        alert(`❌ Not enough XP! You need ${item.price} XP but only have ${userXP} XP. Keep studying to earn more!`);
    }
}
/////////
//// CHAT FUNCTIONALITY WITH AUTOMATED RESPONSES
///////// 
class ChatInterface {
    constructor() {
        this.messages = [];
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');

        this.initEventListeners();
        this.adjustTextareaHeight();

        // Automated response patterns
        this.responses = {
            greetings: [
                "Heyy.. Ready to study or what!? ",
                "Hello... Sorry, being trapped is tiring.",
                "Hey! I'm so excited you can help me... ",
                "Hi! Time to make some progress! (PLEASE)"
            ],
            sad: [
                "I'm sorry you're feeling sad right now. It's okay to have these feelings - I've been sad a lot so I get how you feel.",
                "Sending you a big platy hug.. When I used to have a bad day, I would try doing something I liked, like going in the river.",
                "I can sense you're going through a tough time. 💜 Remember, feelings are temporary, even the difficult ones.",
                "Your feelings matter, and I'm here with you (even though I'm trapped). Sometimes a gentle study session can help distract you.",
                "It's brave of you to share how you're feeling. I wish I had shared how I was feeling.. Take things one step at a time today."
            ],
            stressed: [
                "I hear you... stress can feel really overwhelming. Take a deep breath with me, we will figure stuff out together.",
                "Let's perform some abstraction and break things down into smaller, more manageable pieces together. Haha some CS to cheer you up!",
                "When I feel stressed, I remind myself that I can only do one thing at a time. What's one small thing we could tackle? You're not alone!",
                "Feeling stressed is your mind's way of caring about something important. That shows how much you care.",
                "You don't have to carry all that stress alone. I'm here for you."
            ],
            anxious: [
                "Anxiety can feel so overwhelming. You're not alone in feeling this way, I have often dealt with anxiety and it's going to be okay.",
                "I see you're feeling anxious. Let's focus on what we can control right now. Let's do one thing at a time.",
                "Anxiety is hard, but you've gotten through difficult feelings before. You're stronger than you know... I would know!",
                "When anxiety hits, sometimes focusing on something concrete like studying can help ground us. 🦫💙",
                "You're not alone in this... I'm here!"
            ],
            overwhelmed: [
                "Feeling overwhelmed is like being in a storm... it feels intense, but it will pass. ",
                "I understand that everything feels like too much right now. Let's just focus on one tiny step.",
                "Being overwhelmed shows you care about many things. That's actually a great quality, even when it's hard.",
                "Sometimes when everything feels too big, we need to make things very small. What's one little thing we could do?",
                "You don't have to solve everything today. Just being here and reaching out shows incredible perseverance I wish I had."
            ],
            tired: [
                "Being tired, emotionally or physically is your body's way of asking for care. Have you been getting enough rest?",
                "Tired days are hard. Maybe we could do a gentle, short study session? Sometimes that helps me feel accomplished without being overwhelming.",
                "It's okay to feel tired. Rest is just as important as productivity. Be kind to yourself today.",
                "When you're tired, even small efforts count double. Don't underestimate what you can do, even when you're not at 100%.",
                "Tiredness often means you've been working hard. Your body and mind deserve some gentleness."
            ],
            motivation: [
                "You've got this! Every minute of studying counts! ",
                "Keep going! You're building great habits! ",
                "I believe in you! Stay focused and you'll succeed! ",
                "You're doing amazing! Don't give up! ",
                "Study time is growth time! You're investing in yourself! "
            ],
            study: [
                "Let's start a study session! Pick your time and let's go! ",
                "The best time to study is now! Ready when you are! ",
                "I'm here to keep you company while you study! ",
                "Study sessions are more fun with a platypus friend! "
            ],
            help: [
                "I'm here to motivate you to study! Start a session anytime! ",
                "Need help staying focused? Let's do a study session together! ",
                "I can cheer you on during your study sessions! Want to start one? ",
                "My job is to help you study better! Ready to start? "
            ],
            praise: [
                "You're such a dedicated student! Keep it up! ",
                "I'm so proud of your commitment to learning! ",
                "You're making great progress! I can see the effort! ",
                "Your hard work is really paying off! Amazing! "
            ],
            break: [
                "Don't forget to take breaks! Your brain needs rest too! ",
                "Remember to stretch and hydrate during breaks! ",
                "Breaks are important for learning! You're doing great! ",
                "Rest well so you can study even better! "
            ],
            encouragement: [
                "Every expert was once a beginner! You're on the right path! ",
                "Small steps lead to big achievements! Keep going! ",
                "Learning is a journey, not a race! Enjoy the process! ",
                "You're stronger than you think! Push through! "
            ],
            questions: [
                "I'm just a platypus! But I'm great at cheering you on! ",
                "I don't have all the answers, but I know studying helps! ",
                "That's a great question! Maybe study more to find the answer? ",
                "I'm better at motivation than information! Let's study together! "
            ],
            goodbye: [
                "See you soon! Don't forget to study! ",
                "Goodbye! Come back when you're ready to learn! ",
                "Until next time! Keep up the great work! ",
                "Bye! Remember, I'm always here to study with you! "
            ],
            default: [
                "That's interesting! Want to start a study session? ",
                "I love chatting! But studying is even better! Ready? ",
                "Cool! How about we channel that energy into studying? ",
                "Nice! Let's put that curiosity to work with some studying! ",
                "Awesome! Study time makes everything better! ",
                "Yes I'm still trapped... Help me out?"
            ]
        };
    }

    initEventListeners() {
        // Back button click
        const backButton = document.querySelector('#backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                window.history.back();
            });
        }

        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Enter key to send (Shift+Enter for new line)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => this.adjustTextareaHeight());
    }

    sendMessage() {
        const messageText = this.chatInput.value.trim();
        if (!messageText) return;

        // Create user message object
        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            timestamp: new Date()
        };

        // Add to messages array
        this.messages.push(userMessage);

        // Display message
        this.displayMessage(userMessage);

        // Clear input
        this.chatInput.value = '';
        this.adjustTextareaHeight();

        // Hide empty state if it exists
        const emptyState = this.chatMessages.querySelector('.empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // Show typing indicator
        this.showTypingIndicator();

        // Generate automated response
        this.generateAutomatedResponse(messageText);
    }

    adjustTextareaHeight() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    }

    displayMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        messageDiv.innerHTML = `
            <div>${this.escapeHtml(message.text)}</div>
            <div class="message-time">${this.formatTime(message.timestamp)}</div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    generateAutomatedResponse(userMessage) {
        // Convert message to lowercase for pattern matching
        const message = userMessage.toLowerCase();

        let responseCategory = 'default';


        // Pattern matching for different types of messages
        if (this.containsWords(message, ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            responseCategory = 'greetings';
        } else if (this.containsWords(message, ['sad', 'i\'m sad', 'feeling sad', 'i feel sad', 'depressed', 'down', 'upset', 'crying', 'cry'])) {
            responseCategory = 'sad';
        } else if (this.containsWords(message, ['stressed', 'i\'m stressed', 'feeling stressed', 'stress', 'pressure', 'overwhelmed with stress'])) {
            responseCategory = 'stressed';
        } else if (this.containsWords(message, ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'i\'m anxious', 'feeling anxious'])) {
            responseCategory = 'anxious';
        } else if (this.containsWords(message, ['overwhelmed', 'too much', 'can\'t handle', 'everything is', 'so much to do', 'i\'m overwhelmed'])) {
            responseCategory = 'overwhelmed';
        } else if (this.containsWords(message, ['tired', 'exhausted', 'drained', 'worn out', 'i\'m tired', 'feeling tired', 'so tired'])) {
            responseCategory = 'tired';
        } else if (this.containsWords(message, ['study', 'studying', 'learn', 'learning', 'session', 'focus', 'work'])) {
            responseCategory = 'study';
        } else if (this.containsWords(message, ['help', 'how', 'what', 'can you', 'assist', 'support'])) {
            responseCategory = 'help';
        } else if (this.containsWords(message, ['difficult', 'hard', 'struggle', 'frustrated', 'stuck'])) {
            responseCategory = 'motivation';
        } else if (this.containsWords(message, ['good job', 'well done', 'finished', 'completed', 'done', 'success'])) {
            responseCategory = 'praise';
        } else if (this.containsWords(message, ['break', 'rest', 'pause', 'stop'])) {
            responseCategory = 'break';
        } else if (this.containsWords(message, ['give up', 'quit', 'can\'t do', 'impossible', 'too hard'])) {
            responseCategory = 'encouragement';
        } else if (this.containsWords(message, ['bye', 'goodbye', 'see you', 'later', 'leaving'])) {
            responseCategory = 'goodbye';
        } else if (message.includes('?')) {
            responseCategory = 'questions';
        }

        // Get random response from selected category
        const responses = this.responses[responseCategory];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Simulate typing delay (1-3 seconds)
        const delay = Math.random() * 2000 + 1000;

        setTimeout(() => {
            this.hideTypingIndicator();

            const aiMessage = {
                id: Date.now(),
                text: randomResponse,
                sender: 'ai',
                timestamp: new Date()
            };

            this.messages.push(aiMessage);
            this.displayMessage(aiMessage);
        }, delay);
    }

    containsWords(message, words) {
        return words.some(word => message.includes(word));
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Utility methods
    getMessages() {
        return this.messages;
    }

    addAIMessage(text) {
        this.hideTypingIndicator();

        const aiMessage = {
            id: Date.now(),
            text: text,
            sender: 'ai',
            timestamp: new Date()
        };

        this.messages.push(aiMessage);
        this.displayMessage(aiMessage);
    }

    clearChat() {
        this.messages = [];
        this.chatMessages.innerHTML = `
            <div class="empty-state">
                <div class="platy-welcome"></div>
                <p>Hi there! I'm your friendly platypus assistant. How can I help you today?</p>
            </div>
        `;
    }

    exportMessages() {
        return JSON.stringify(this.messages, null, 2);
    }

    importMessages(messagesJson) {
        try {
            const messages = JSON.parse(messagesJson);
            this.messages = messages;
            this.renderAllMessages();
        } catch (error) {
            console.error('Failed to import messages:', error);
        }
    }

    renderAllMessages() {
        this.chatMessages.innerHTML = '';
        if (this.messages.length === 0) {
            this.chatMessages.innerHTML = `
                <div class="empty-state">
                    <div class="platy-welcome"></div>
                    <p>Hi there! I'm your friendly platypus assistant. How can I help you today?</p>
                </div>
            `;
        } else {
            this.messages.forEach(message => this.displayMessage(message));
        }
    }
}

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the chat page
    if (document.getElementById('chatMessages')) {
        window.chatInterface = new ChatInterface();
    }
});

// TIME SELECTION FUNCTIONALITY