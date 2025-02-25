const foods = [
    "Cơm tấm", "Bún bò", "Nem nướng", "Bún riêu", "Hủ tiếu gõ",
    "Bún đậu", "Vịt lộn", "Bánh mì xíu mại", "Xiên bẩn", "Phở",
    "Ốc", "Jollibee", "Texas", "Mì cay", "Chè",
    "Flan", "Bánh mì", "Tré trộn", "Bột chiên", "Bánh xèo",
    "Đồ chay", "Bún thái", "Mì hến", "Bún mắm", "Sủi cảo",
    "Mì quảng", "Cơm gà", "Bánh bèo", "Bánh lọc Huế", "Lẩu gà lá é",
    "Lẩu bò", "Hanuri", "Phá lấu", "Bánh cuốn", "Bánh ướt",
    "Lẩu dê", "Má heo nướng", "Bánh canh cua", "Cháo lòng", "Bánh mì chảo",
    "Lạp xưởng nướng", "Kem cá", "Súp", "Bún chả", "Bánh tráng nướng",
    "Pizza", "Taco", "Takoyaki", "Busan", "Bánh đúc",
    "Bánh mây", "Cơm heo chiên xù"
];

const elements = {
    spinButton: document.getElementById('spinButton'),
    slotItems: document.getElementById('foodSlot')
};

const spinSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
const endSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
spinSound.volume = 0.3;
endSound.volume = 0.3;
spinSound.preload = 'auto';
endSound.preload = 'auto';

let isSpinning = false;
let sparkleInterval;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const itemHeight = isMobile ? 50 : 60;

function createSlotItems() {
    const allItems = [...foods, ...foods];
    elements.slotItems.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    allItems.forEach(food => {
        const div = document.createElement('div');
        div.className = 'slot-item';
        div.textContent = food;
        fragment.appendChild(div);
    });
    
    elements.slotItems.appendChild(fragment);
}

function getRandomFood() {
    return foods[Math.floor(Math.random() * foods.length)];
}

function addSparkles() {
    if (isMobile && sparkleInterval % 2 !== 0) return;
    
    const sparkles = ['✨', '⭐', '🌟'];
    const container = document.querySelector('.container');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    container.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    
    elements.spinButton.disabled = true;
    elements.spinButton.classList.add('active');
    spinSound.currentTime = 0;
    spinSound.play();

    sparkleInterval = setInterval(addSparkles, isMobile ? 300 : 200);

    const targetFood = getRandomFood();
    const targetIndex = foods.indexOf(targetFood);
    const extraSpins = 2;
    const totalItems = foods.length;
    const finalPosition = (extraSpins * totalItems + targetIndex) * itemHeight;
    
    requestAnimationFrame(() => {
        elements.slotItems.style.transform = `translateY(-${finalPosition}px)`;
    });

    setTimeout(() => {
        endSound.currentTime = 0;
        endSound.play();
        
        elements.spinButton.disabled = false;
        elements.spinButton.classList.remove('active');
        
        requestAnimationFrame(() => {
            elements.slotItems.style.transition = 'none';
            elements.slotItems.style.transform = `translateY(-${targetIndex * itemHeight}px)`;
            elements.slotItems.offsetHeight;
            elements.slotItems.style.transition = 'transform 4s cubic-bezier(0.21, 0.53, 0.29, 0.99)';
        });
        
        clearInterval(sparkleInterval);
        isSpinning = false;
    }, 4000);
}

createSlotItems();
elements.spinButton.addEventListener('click', spin);
setInterval(addSparkles, isMobile ? 3000 : 2000);

