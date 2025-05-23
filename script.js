// Morse code dictionary
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 
    'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', 
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', 
    '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', 
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', 
    ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', 
    '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

// Reverse the morseCode object for decoding
const reverseMorse = {};
for (const key in morseCode) {
    reverseMorse[morseCode[key]] = key;
}

/**
 * Converts text to Morse code
 * @param {string} text - The text to convert
 * @returns {string} The Morse code representation
 */
function lettersToMorseCode(text) {
    return text.toUpperCase().split('').map(char => {
        return morseCode[char] || char;
    }).join(' ');
}

/**
 * Converts Morse code to text
 * @param {string} code - The Morse code to convert
 * @returns {string} The text representation
 */
function morseCodeToLetters(code) {
    return code.split(' ').map(symbol => {
        return reverseMorse[symbol] || symbol;
    }).join('');
}

/**
 * Plays Morse code as beeps
 * @param {string} morse - The Morse code to play
 */
function playMorseCode(morse) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const dot = 0.1; // Duration of a dot in seconds
    const freq = 800; // Frequency of the beep in Hz
    
    let time = audioContext.currentTime;
    
    for (const char of morse) {
        switch (char) {
            case '.':
                playBeep(audioContext, freq, time, dot);
                time += dot;
                break;
            case '-':
                playBeep(audioContext, freq, time, dot * 3);
                time += dot * 3;
                break;
            case ' ':
                time += dot * 3; // Space between letters
                break;
            case '/':
                time += dot * 7; // Space between words
                break;
        }
        // Add space after each symbol
        time += dot;
    }
    
    /**
     * Helper function to play a beep
     */
    function playBeep(audioContext, freq, startTime, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(1, startTime + 0.001);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration - 0.001);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
}

// DOM elements
const inputText = document.getElementById('inputText');
const inputMorse = document.getElementById('inputMorse');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const playBtn = document.getElementById('playBtn');
const playBtnMorse = document.getElementById('playBtnMorse');
const clearBtn = document.getElementById('clearBtn');
const clearBtnMorse = document.getElementById('clearBtnMorse');

// Event listeners
encodeBtn.addEventListener('click', () => {
    const text = inputText.value.trim();
    if (text) {
        inputMorse.value = lettersToMorseCode(text);
    }
});

decodeBtn.addEventListener('click', () => {
    const code = inputMorse.value.trim();
    if (code) {
        inputText.value = morseCodeToLetters(code);
    }
});

playBtn.addEventListener('click', () => {
    const text = inputText.value.trim();
    if (text) {
        playMorseCode(lettersToMorseCode(text));
    }
});

playBtnMorse.addEventListener('click', () => {
    const code = inputMorse.value.trim();
    if (code) {
        playMorseCode(code);
    }
});

clearBtn.addEventListener('click', () => {
    inputText.value = '';
});

clearBtnMorse.addEventListener('click', () => {
    inputMorse.value = '';
});