const dryDishes = [
    "Cơm gà",
    "Bún chả",
    "Phở xào",
    "Bánh mì",
    "Cơm tấm",
    "Bún đậu",
    "Mì xào",
    "Gỏi cuốn",
    "Bánh cuốn",
    "Xôi gà",
    "Cơm chiên",
    "Bún trộn",
    "Bánh xèo",
    "Nem nướng",
    "Bò lúc lắc"
];

const soupDishes = [
    "Phở bò",
    "Bún bò",
    "Hủ tiếu",
    "Bánh canh",
    "Bún riêu",
    "Mì Quảng",
    "Cháo",
    "Lẩu",
    "Canh chua",
    "Súp cua",
    "Bún mắm",
    "Bún mộc",
    "Miến gà",
    "Bún ốc",
    "Cháo lòng"
];

// Cache DOM elements
const elements = {
    tabButtons: document.querySelectorAll('.tab-button'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    spinDryButton: document.getElementById('spinDryButton'),
    spinSoupButton: document.getElementById('spinSoupButton'),
    dryDishWheel: document.getElementById('dryDishWheel').querySelector('.wheel-content'),
    soupDishWheel: document.getElementById('soupDishWheel').querySelector('.wheel-content'),
    dryDishResult: document.getElementById('dryDishResult'),
    soupDishResult: document.getElementById('soupDishResult')
};

elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        
        elements.tabButtons.forEach(btn => btn.classList.remove('active'));
        elements.tabPanes.forEach(pane => pane.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

const spinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
const endSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
spinSound.volume = 0.3;
endSound.volume = 0.3;
spinSound.preload = 'auto';
endSound.preload = 'auto';

const colors = [
    '#FFB5B5',
    '#B5D8FF',
    '#FFE5B5',
    '#B5FFB5',
    '#E5B5FF',
    '#FFB5E5',
    '#B5FFE5',
    '#E5FFB5',
    '#B5B5FF',
    '#FFE5E5',
    '#E5FFE5',
    '#E5E5FF',
    '#FFE5FF',
    '#B5E5FF',
    '#E5FFE5'
];

let confettiCount = 0;
const MAX_CONFETTI = 20;

function createConfetti() {
    if (confettiCount >= MAX_CONFETTI) return;
    
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
    document.body.appendChild(confetti);
    
    confettiCount++;
    
    setTimeout(() => {
        confetti.remove();
        confettiCount--;
    }, 3000);
}

function createWheel(wheel, dishes) {
    const slices = dishes.length;
    const angleStep = 360 / slices;
    wheel.innerHTML = '';
    
    for (let i = 0; i < slices; i++) {
        const slice = document.createElement('div');
        slice.className = 'wheel-item';
        slice.style.backgroundColor = colors[i % colors.length];
        slice.style.transform = `rotate(${angleStep * i}deg) skewY(${90 - angleStep}deg)`;
        
        const text = document.createElement('span');
        text.textContent = dishes[i];
        slice.appendChild(text);
        
        wheel.appendChild(slice);
    }
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

function createImageParticle(x, y) {
    // Create multiple particles with different paths
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('img');
        particle.src = 'assets/image.png';
        particle.className = 'image-particle';
        
        // Random end position with dynamic distance based on index
        const angle = (Math.random() * Math.PI * 2) + (i * (Math.PI * 2 / 3));
        const baseDistance = 300 + Math.random() * 200;
        const distance = baseDistance * (1 + i * 0.2);
        
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        
        // Add slight random offset to starting position
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = (Math.random() - 0.5) * 50;
        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }
}

function showResult(result, text) {
    result.textContent = text;
    result.classList.add('show');
    result.classList.add('highlight');
    
    let created = 0;
    function createNextConfetti() {
        if (created < MAX_CONFETTI) {
            createConfetti();
            // Add image particles
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createImageParticle(x, y);
            created++;
            requestAnimationFrame(createNextConfetti);
        }
    }
    requestAnimationFrame(createNextConfetti);
}

function spinWheel(wheel, dishes, resultElement, button) {
    button.disabled = true;
    spinSound.currentTime = 0;
    spinSound.play();
    
    const randomIndex = Math.floor(Math.random() * dishes.length);
    const extraSpins = Math.floor(Math.random() * 3) + 5;
    const rotation = (360 * extraSpins) + (360 - (randomIndex * (360 / dishes.length)));

    requestAnimationFrame(() => {
        wheel.style.transition = 'none';
        wheel.style.transform = 'rotate(0deg)';
        wheel.offsetHeight;
        wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        wheel.style.transform = `rotate(${rotation}deg)`;
    });

    resultElement.classList.remove('show', 'highlight');

    setTimeout(() => {
        endSound.currentTime = 0;
        endSound.play();
        
        shakeElement(wheel.parentElement);
        showResult(resultElement, dishes[randomIndex]);
        
        button.disabled = false;
    }, 4000);
}

createWheel(elements.dryDishWheel, dryDishes);
createWheel(elements.soupDishWheel, soupDishes);

elements.spinDryButton.addEventListener('click', () => 
    spinWheel(elements.dryDishWheel, dryDishes, elements.dryDishResult, elements.spinDryButton)
);

elements.spinSoupButton.addEventListener('click', () => 
    spinWheel(elements.soupDishWheel, soupDishes, elements.soupDishResult, elements.spinSoupButton)
);

