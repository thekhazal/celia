// Variable to store the latest button click value
let latestButtonClickValue = null;

// Function to run when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Event listener for the generate button
    document.getElementById('generateButton').addEventListener('click', function () {
        // Get the input type from the generate button
        const inputType = document.getElementById('generateButton').value;
        // Generate random values based on the input type
        generateRandom(inputType);
        // Store the latest button click value
        latestButtonClickValue = inputType;
    });

    // Event listener for the background music checkbox
    document.getElementById('musicCheckbox').addEventListener('change', toggleBackgroundMusic);

    // Event listener for the volume control input
    document.getElementById('volumeControl').addEventListener('input', toggleBackgroundMusic);
});

// Function to toggle background music based on checkbox state
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

// Function to speak text using speech synthesis
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    speechSynthesis.speak(utterance);
}

// Function to play audio
function playAudio(audioId, volume) {
    const audio = document.getElementById(audioId);
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play();
}

// Function to generate random values based on input type
async function generateRandom(inputType) {
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
        case 'WORDS':
            values = getRandomWords(9);
            break;
        case 'ANIMALS':
            values = await getRandomAnimalImages(9);
            break;
        default:
            console.error('Invalid input type');
            return;
    }

    values.forEach((value, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        if (inputType === 'ANIMALS') {
            const img = document.createElement('img');
            img.src = value;
            img.alt = 'Animal';
            card.appendChild(img);
            // Set the resultValue div to display the same image
            if (index === 0) {
                document.getElementById('resultValue').innerHTML = `<img src="${value}" alt="Animal">`;
            }
        } else {
            card.textContent = value;
        }
        card.onclick = function () {
            playAudio('clickSound', 0.5);

            if (inputType === 'ANIMALS') {
                // For images, compare the src attribute of the clicked image with the first value of the array
                if (card.querySelector('img').src === values[0]) {
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
            } 
            else if (inputType === '123') {
                // For numbers compare the text content of the clicked card with the first value of the array
                if (parseInt(card.textContent) === values[0]) {
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
            }
            else {
                // For letters, and figures, compare the text content of the clicked card with the first value of the array
                if (card.textContent === values[0]) {
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
            }
        };

        grid.appendChild(card);
    });

    switch (inputType) {
        case 'ABC':
            speak('Hitta bokstaven: ' + values[0]);
            document.getElementById('resultValue').textContent = values[0];
            break;
        case '123':
            speak('Hitta siffran: ' + values[0]);
            document.getElementById('resultValue').textContent = values[0];
            break;
        case 'FIGURES':
            speak('Hitta figuren: ' + values[0]);
            document.getElementById('resultValue').textContent = values[0];
            break;
        case 'WORDS':
            speak('Hitta ordet: '+ values[0]);
            document.getElementById('resultValue').textContent = values[0];
            break;
        case 'ANIMALS':
            speak('Hitta bilden: ');
            break;
        default:
            console.error('Invalid input type');
        return;
    }

    shuffleGrid(grid);
}


// Function to generate random letters
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

// Function to generate random numbers within a range
function getRandomNumbers(count, min, max) {
    if (count > max - min + 1) {
        console.error('Count exceeds range of numbers');
        return [];
    }

    const numbers = new Set();
    while (numbers.size < count) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(randomNumber);
    }
    return Array.from(numbers);
}


// Function to generate random figures
function getRandomFigures(count) {
    const figures = [
        '🔴', '🔵', '⚫', '⚪', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '🟠', '🟡', '🟢', '🟣', '🟤', '🟥', '🟦', '🟧', '🟨', '🟩',
        '🟪', '🟫', '⬛', '⬜', '◼', '◻', '◾', '◽', '▪', '▫', '🟥', '🟧', '🟩', '🟦', '🟨', '🟪', '🟫', '⬛', '⬜', '◼', '◻', '◾', '◽', '▪', '▫'
    ];
    return shuffleArray(figures).slice(0, count);
}

// Function to generate random figures
function getRandomWords(count) {
    const words = [
        "hej", "välkommen", "tack", "snäll", "glad", "bra", "godis", "leka", "skola", "bok",
        "tåg", "bil", "boll", "cykel", "glass", "hund", "katt", "fisk", "apa", "häst",
        "apa", "fågel", "blomma", "nalle", "vatten", "mjölk", "frukt", "sol", "måne", "stjärna",
        "regn", "snö", "vind", "varm", "kall", "klänning", "byxor", "skor", "sockor", "hjärta",
        "hand", "ben", "mun", "näsa", "öga", "öra", "mage", "huvud", "tand"
    ];
    return shuffleArray(words).slice(0, count);
}

async function getRandomAnimalImages(count) {
    const images = [];
    try {
        for (let i = 0; i < count; i++) {
            const response = await fetch("https://loremflickr.com/300/300/animals?");
            const imageUrl = response.url;
            images.push(imageUrl);
        }
    } catch (error) {
        console.error('Error fetching animal images:', error);
    }
    return images;
}

// Function to shuffle array elements
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to shuffle grid elements
function shuffleGrid(grid) {
    for (let i = grid.children.length; i >= 0; i--) {
        grid.appendChild(grid.children[Math.random() * i | 0]);
    }
}

// Function to show result message and update result value color
function showResult(message, isCorrect) {
    const resultText = document.getElementById('resultText');
    const resultValue = document.getElementById('resultValue');
    resultText.textContent = message;

    setTimeout(() => {
        resultText.textContent = '';
    }, 1500);
}

// Function to reset card colors and generate new values
function resetCards(grid) {
    const cards = grid.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.backgroundColor = '#007bff';
    });
    // Generate new values based on the latest button click value
    generateRandom(latestButtonClickValue);
}
