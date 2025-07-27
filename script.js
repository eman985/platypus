////////////
// STUDY SESSION FUNCTIONALITY
////////////
let timeRemaining = 25 * 60; // 25 minutes in seconds
let totalTime = 25 * 60;
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
    ],
    xpReward: [
        "Great progress! +5 XP! 🌟",
        "Keep it up! +5 XP! 💪",
        "Milestone reached! +5 XP! 🎯",
        "Fantastic! +5 XP! ⭐"
    ]
};

// Initialize based on current page
window.addEventListener('DOMContentLoaded', function () {
    // Update XP display on all pages
    updateXPDisplay();

    // Check if we're on the study session page
    if (document.getElementById('timerDisplay')) {
        console.log('Study session page loaded, starting timer...');
        initializeStudySession();
    }
    // Check if we're on the story page
    else if (document.getElementById('story-image')) {
        console.log('Story page loaded, starting story...');
        initializeStory();
    }
    // Check if we're on the shop page
    else if (document.getElementById('shopContainer')) {
        console.log('Shop page loaded, initializing shop...');
        initializeShop();
    }
});

function initializeStudySession() {
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
    } else if (elapsed === Math.floor(totalTime / 2)) { // Halfway (12.5 minutes)
        showSpeechBubble(messages.xpReward[1]);
        addXP(5);
    } else if (timeRemaining === 5 * 60) { // 5 minutes left (20 minutes elapsed)
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
        window.location.href = './index.html';
    }
}

function timerComplete() {
    clearInterval(timerInterval);

    if (!isBreakTime) {
        // Focus session completed - award big XP bonus!
        addXP(20);
        showSpeechBubble("🎉 Session complete! +20 XP! 🎉");

        isBreakTime = true;
        timeRemaining = 5 * 60;
        totalTime = 5 * 60;

        const timerDisplay = document.getElementById('timerDisplay');
        const progressFill = document.getElementById('progressFill');

        if (timerDisplay) timerDisplay.style.color = '#27ae60';
        if (progressFill) progressFill.style.backgroundColor = '#27ae60';

        alert('🎉 Focus session complete! You earned 20 XP! Time for a 5-minute break!');
        startTimer();

    } else {
        isBreakTime = false;
        timeRemaining = 25 * 60;
        totalTime = 25 * 60;

        const timerDisplay = document.getElementById('timerDisplay');
        const progressFill = document.getElementById('progressFill');

        if (timerDisplay) timerDisplay.style.color = '#e74c3c';
        if (progressFill) progressFill.style.backgroundColor = '#e74c3c';

        alert('Break time over! Ready for another focus session?');
        startTimer();
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
//// CHAT FUNCTIONALITY
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
    }

    async chatWithAI(userMessage) {
        try {
            // This calls your main process which handles the API
            const aiResponse = await window.electronAPI.sendMessage(userMessage);
            return aiResponse;
        } catch (error) {
            console.error('Error:', error);
            return 'Oops! Something went wrong.';
        }
    }
    initEventListeners() {
        // Back button click
        document.getElementById('backButton').addEventListener('click', () => {
            // You can customize this to go to your specific home page
            window.history.back();
            // Or use: window.location.href = '/'; for a specific URL
        });

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

        // Here you would normally send to your AI
        // For now, we'll just simulate a response
        this.simulateAIResponse(messageText);
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

    async simulateAIResponse(userMessage) {
        try {
            // Call the actual AI instead of simulating
            const aiResponse = await this.chatWithAI(userMessage);

            this.hideTypingIndicator();

            const aiMessage = {
                id: Date.now(),
                text: aiResponse,
                sender: 'ai',
                timestamp: new Date()
            };

            this.messages.push(aiMessage);
            this.displayMessage(aiMessage);
        } catch (error) {
            this.hideTypingIndicator();
            console.error('AI Error:', error);

            // Show error message to user
            const errorMessage = {
                id: Date.now(),
                text: 'Oops! Something went wrong. Please try again.',
                sender: 'ai',
                timestamp: new Date()
            };

            this.messages.push(errorMessage);
            this.displayMessage(errorMessage);
        }
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

    // Methods for your AI integration
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
    window.chatInterface = new ChatInterface();
});

// Helper functions for external integration
function sendToAI(message) {
    // This is where you'll integrate your AI
    // For now, it's handled by the simulateAIResponse method
    console.log('Message to send to AI:', message);
}

function receiveFromAI(response) {
    // Call this function when you receive a response from your AI
    if (window.chatInterface) {
        window.chatInterface.addAIMessage(response);
    }
}