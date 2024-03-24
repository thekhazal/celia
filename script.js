document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('generateButton').addEventListener('click', function () {
        generateRandom();
    });

    // Event listener for the background music checkbox
    document.getElementById('musicCheckbox').addEventListener('change', toggleBackgroundMusic);

    // Event listener for the volume control input
    document.getElementById('volumeControl').addEventListener('input', toggleBackgroundMusic);
});

function playAudio(audioId, volume) {
    const audio = document.getElementById(audioId);
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play();
}

function generateRandom() {
    const minRange = parseInt(document.getElementById('minRange').value);
    const maxRange = parseInt(document.getElementById('maxRange').value);

    if (minRange >= maxRange) {
        alert('Vänligen ange ett giltigt nummerintervall.');
        return;
    }

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    const numbers = [];
    while (numbers.length < 9) {
        const randomNumber = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }

    numbers.sort(() => Math.random() - 0.5); // Shuffle the numbers

    for (let i = 0; i < 9; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = numbers[i];
        card.onclick = function() {
            playAudio('clickSound', 0.5);

            if (parseInt(card.textContent) === numbers[0]) {
                showResult('Grattis! Du matchade numret.', true);
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
    }

    const cardToFindNumber = numbers[0];
    speak('Hitta numret: ' + cardToFindNumber);
    document.getElementById('resultValue').textContent = cardToFindNumber;

    shuffleGrid(grid);
}

function resetCards(grid) {
    const cards = grid.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.backgroundColor = '#007bff';
    });
    generateRandom();
}

function shuffleGrid(grid) {
    for (let i = grid.children.length; i >= 0; i--) {
        grid.appendChild(grid.children[Math.random() * i | 0]);
    }
}

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
    speechSynthesis.speak(utterance);resultText
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

