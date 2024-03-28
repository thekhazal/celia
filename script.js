let latestButtonClickValue = null;

document.addEventListener('DOMContentLoaded', function () {
     // Event listener for the generate button
     document.getElementById('generateButton').addEventListener('click', function () {
        const inputType = document.getElementById('generateButton').value;
        generateRandom(inputType);
        latestButtonClickValue = inputType; // Store the latest button click value
    });

    // Event listener for the background music checkbox
    document.getElementById('musicCheckbox').addEventListener('change', toggleBackgroundMusic);

    // Event listener for the volume control input
    document.getElementById('volumeControl').addEventListener('input', toggleBackgroundMusic);
});

function toggleBackgroundMusic() {
    const musicCheckbox = document.getElementById('musicCheckbox');
    const volumeControl = document.getElementById('volumeControl');
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (musicCheckbox.checked) {
        backgroundMusic.volume = volumeControl.value;
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    speechSynthesis.speak(utterance);
}

function playAudio(audioId, volume) {
    const audio = document.getElementById(audioId);
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play();
}
function generateRandom(inputType) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    let values = [];

    switch (inputType) {
        case 'ABC':
            values = getRandomLetters(9);
            break;
        case '123':
            const minRange = parseInt(document.getElementById('minRange').value);
            const maxRange = parseInt(document.getElementById('maxRange').value);
            if (isNaN(minRange) || isNaN(maxRange) || minRange >= maxRange) {
                console.error('Invalid number range');
                return;
            }
            values = getRandomNumbers(9, minRange, maxRange);
            break;
        case 'FIGURES':
            values = getRandomFigures(9);
            break;
        default:
            console.error('Invalid input type');
            return;
    }

    values.forEach(value => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = value;
        card.onclick = function () {
            playAudio('clickSound', 0.5);
            
            if (latestButtonClickValue == 123 & parseInt(card.textContent) === values[0]) { // Convert card.textContent to integer
                showResult('Grattis! Du matchade värdet.', true);
                card.style.backgroundColor = '#28a745';
                playAudio('matchSound', 0.5);
                setTimeout(() => {
                    resetCards(grid);
                }, 1000);
            }

            else if (card.textContent === values[0]) {
                showResult('Grattis! Du matchade värdet.', true);
                card.style.backgroundColor = '#28a745';
                playAudio('matchSound', 0.5);
                setTimeout(() => {
                    resetCards(grid);
                }, 1000);
            } else {
                showResult('Tyvärr, försök igen.', false);
                card.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    card.style.backgroundColor = '#007bff';
                }, 1000);
            }
        };
        grid.appendChild(card);
    });

    speak('Hitta värdet: ' + values[0]);
    document.getElementById('resultValue').textContent = values[0];

    shuffleGrid(grid);
}

function getRandomLetters(count) {
    const swedishAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
    const letters = [];
    while (letters.length < count) {
        const randomLetter = swedishAlphabet[Math.floor(Math.random() * swedishAlphabet.length)];
        if (!letters.includes(randomLetter)) {
            letters.push(randomLetter);
        }
    }
    return letters;
}

function getRandomNumbers(count, min, max) {
    const numbers = new Set();
    while (numbers.size < count) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}

function getRandomFigures(count) {
    const figures = ['♠', '♣', '♥', '♦', '★', '☆', '▲', '◆', '○']; // Sample figures
    return shuffleArray(figures).slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function shuffleGrid(grid) {
    for (let i = grid.children.length; i >= 0; i--) {
        grid.appendChild(grid.children[Math.random() * i | 0]);
    }
}

function showResult(message, isCorrect) {
    const resultText = document.getElementById('resultText');
    const resultValue = document.getElementById('resultValue');

    resultText.textContent = message;
    resultValue.style.backgroundColor = isCorrect ? '#28a745' : '#dc3545';

    setTimeout(() => {
        resultText.textContent = '';
        //resultValue.style.backgroundColor = '#007bff';
    }, 1500);
}

function resetCards(grid) {
    const cards = grid.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.backgroundColor = '#007bff';
    });
    generateRandom(latestButtonClickValue);
}