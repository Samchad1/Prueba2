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

startButton.addEventListener('click', startGame);
guessButton.addEventListener('click', checkLetter);

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
    selectedWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
    wordContainer.innerHTML = '';
    parts.forEach(p => p.style.visibility = 'hidden');
    for (let i = 0; i < selectedWord.length; i++) {
        const div = document.createElement('div');
        div.classList.add('letter');
        div.textContent = '';
        wordContainer.appendChild(div);
    }
    guessInput.disabled = false;
    guessButton.disabled = false;
    guessInput.focus();
}

function checkLetter() {
    const letter = guessInput.value.toLowerCase();
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
        }
    }
}
