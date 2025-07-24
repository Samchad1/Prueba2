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

const wordContainer = document.getElementById('word');
const message = document.getElementById('message');
const guessInput = document.getElementById('guess');
const guessButton = document.getElementById('guessButton');
const startButton = document.getElementById('start');
const parts = document.querySelectorAll('.part');
const bloodContainer = document.getElementById('blood');

startButton.addEventListener('click', startGame);
guessButton.addEventListener('click', () => checkLetter());

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

function startGame() {
    fails = 0;
    guessed = [];
    message.textContent = '';
    guessInput.value = '';
    bloodContainer.style.opacity = '0';
    bloodContainer.innerHTML = '';
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
            }
        }
    });
    guessInput.disabled = false;
    guessButton.disabled = false;
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

function checkLetter(provided) {
    const letter = (provided || guessInput.value).toLowerCase();
    guessInput.value = '';
    if (!letter || letter.length !== 1 || guessed.includes(letter)) {
        return;
    }
    guessed.push(letter);

    if (selectedWord.includes(letter)) {
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                wordContainer.children[i].textContent = letter;
            }
        }
        if (Array.from(wordContainer.children).every(c => c.textContent !== '')) {
            message.textContent = '¡Has ganado!';
            guessInput.disabled = true;
            guessButton.disabled = true;
        }
    } else {
        fails++;
        if (fails <= parts.length) {
            parts[fails - 1].style.visibility = 'visible';
        }
        if (fails >= maxFails) {
            message.textContent = 'Has fallado. La palabra era: ' + selectedWord;
            guessInput.disabled = true;
            guessButton.disabled = true;
            showBloodSplash();
        }
    }
}
