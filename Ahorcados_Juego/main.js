const words = [
    'manzana', 'perro', 'guitarra', 'montana', 'telefono', 'escuela',
    'elefante', 'cascada', 'jardin', 'libro', 'biblioteca', 'camion',
    'ventana', 'amigo', 'futbol', 'zapato', 'playa', 'arena',
    'mariposa', 'bosque', 'ciudad', 'flor', 'risa', 'computadora',
    'luces', 'avion', 'pelota', 'naranja', 'sol', 'luna'
];

let selectedWord = '';
let fails = 0;
const maxFails = 6;
let guessed = [];
let extraAttempts = 0;
let score = 0;
let successes = 0;
let timeLeft = 60;
let timerId = null;

const scoreDisplay = document.getElementById('score');
const attemptsDisplay = document.getElementById('attempts');
const successesDisplay = document.getElementById('successes');
const errorsDisplay = document.getElementById('errors');
const timerDisplay = document.getElementById('timer');
const buyButton = document.getElementById('buyAttempts');
const hangman = document.getElementById('hangman');
const scaryOverlay = document.getElementById('scaryOverlay');
const winModal = document.getElementById('winModal');
const closeModal = document.getElementById('closeModal');

const wordContainer = document.getElementById('word');
const message = document.getElementById('message');
const guessInput = document.getElementById('guess');
const guessButton = document.getElementById('guessButton');
const startButton = document.getElementById('start');
const parts = document.querySelectorAll('.part');
const bloodContainer = document.getElementById('blood');

startButton.addEventListener('click', startGame);
guessButton.addEventListener('click', () => checkLetter());
buyButton.addEventListener('click', buyAttempts);
closeModal.addEventListener('click', () => {
    winModal.classList.remove('show');
});

// Allow guessing by pressing any letter key on the keyboard.
document.addEventListener('keydown', event => {
    if (guessInput.disabled) return;
    const letter = event.key.toLowerCase();
    if (/^[a-zñáéíóúü]$/i.test(letter)) {
        checkLetter(letter);
    }
});

guessInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        checkLetter();
    }
});

function updateScore() {
    scoreDisplay.textContent = 'Puntuaci\u00f3n: ' + score;
}

function updateStats() {
    const attemptsLeft = (maxFails + extraAttempts) - fails;
    attemptsDisplay.textContent = 'Intentos: ' + attemptsLeft;
    successesDisplay.textContent = 'Éxitos: ' + successes;
    errorsDisplay.textContent = 'Errores: ' + fails;
    timerDisplay.textContent = 'Tiempo: ' + timeLeft + 's';
}

function startGame() {
    fails = 0;
    extraAttempts = 0;
    successes = 0;
    timeLeft = 60;
    clearInterval(timerId);
    guessed = [];
    message.textContent = '';
    guessInput.value = '';
    bloodContainer.style.opacity = '0';
    bloodContainer.innerHTML = '';
    buyButton.style.display = 'none';
    hangman.classList.remove('free');
    scaryOverlay.classList.remove('show');
    winModal.classList.remove('show');
    selectedWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
    wordContainer.innerHTML = '';
    parts.forEach(p => p.style.visibility = 'hidden');
    for (let i = 0; i < selectedWord.length; i++) {
        const div = document.createElement('div');
        div.classList.add('letter');
        div.textContent = '';
        wordContainer.appendChild(div);
    }
    // Reveal some letters as hints. If the word has fewer than
    // four letters, no hints are shown.
    const hintCount = selectedWord.length < 4 ? 0 : 2;
    const revealed = new Set();
    while (revealed.size < hintCount) {
        const letter = selectedWord[Math.floor(Math.random() * selectedWord.length)];
        revealed.add(letter);
    }
    revealed.forEach(letter => {
        if (!guessed.includes(letter)) {
            guessed.push(letter);
        }
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                wordContainer.children[i].textContent = letter;
                successes++;
            }
        }
    });
    guessInput.disabled = false;
    guessButton.disabled = false;
    updateScore();
    updateStats();
    timerId = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            message.textContent = 'Tiempo agotado. La palabra era: ' + selectedWord;
            guessInput.disabled = true;
            guessButton.disabled = true;
            showBloodSplash();
            showScaryFace();
            if (score >= 5) {
                buyButton.style.display = 'inline-block';
            }
        }
        updateStats();
    }, 1000);
    guessInput.focus();
}

function showBloodSplash() {
    bloodContainer.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('div');
        drop.classList.add('blood-drop');
        const size = Math.random() * 30 + 10;
        drop.style.width = size + 'px';
        drop.style.height = size + 'px';
        drop.style.top = Math.random() * 100 + '%';
        drop.style.left = Math.random() * 100 + '%';
        bloodContainer.appendChild(drop);
    }
    bloodContainer.style.opacity = '1';
    setTimeout(() => {
        bloodContainer.style.opacity = '0';
        setTimeout(() => {
            bloodContainer.innerHTML = '';
        }, 1000);
    }, 100);
}

function showScaryFace() {
    hangman.classList.add('free');
    scaryOverlay.classList.add('show');
    setTimeout(() => {
        scaryOverlay.classList.remove('show');
    }, 1500);
}

function buyAttempts() {
    const cost = 5;
    if (score < cost) {
        message.textContent = 'No tienes puntos suficientes';
        return;
    }
    score -= cost;
    extraAttempts += 3;
    updateScore();
    updateStats();
    message.textContent = '';
    guessInput.disabled = false;
    guessButton.disabled = false;
    buyButton.style.display = 'none';
    bloodContainer.style.opacity = '0';
    bloodContainer.innerHTML = '';
}

function checkLetter(provided) {
    const letter = (provided || guessInput.value).toLowerCase();
    guessInput.value = '';
    if (!letter || letter.length !== 1 || guessed.includes(letter)) {
        return;
    }
    guessed.push(letter);

    if (selectedWord.includes(letter)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter && wordContainer.children[i].textContent === '') {
                wordContainer.children[i].textContent = letter;
                successes++;
            }
        }
        updateStats();
        if (Array.from(wordContainer.children).every(c => c.textContent !== '')) {
            message.textContent = '¡Has ganado!';
            score += 10;
            updateScore();
            clearInterval(timerId);
            guessInput.disabled = true;
            guessButton.disabled = true;
            winModal.classList.add('show');
        }
    } else {
        fails++;
        if (fails <= parts.length) {
            parts[fails - 1].style.visibility = 'visible';
        }
        updateStats();
        if (fails >= maxFails + extraAttempts) {
            message.textContent = 'Has fallado. La palabra era: ' + selectedWord;
            guessInput.disabled = true;
            guessButton.disabled = true;
            clearInterval(timerId);
            showBloodSplash();
            showScaryFace();
            if (score >= 5) {
                buyButton.style.display = 'inline-block';
            }
        }
    }
}
