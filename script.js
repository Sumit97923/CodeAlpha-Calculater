// script.js
const screen = document.getElementById('screen');
const preview = document.getElementById('preview');

let currentInput = '0';
let resetScreen = false;

// Append digits or decimal point
function appendNumber(number) {
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        if (number === '.' && currentInput.endsWith('.')) return;
        currentInput += number;
    }
    updateDisplay();
    updatePreview();
    animateButton(event);
}

// Append operators gracefully
function appendOperator(operator) {
    const lastChar = currentInput.trim().slice(-1);
    
    if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
    updatePreview();
    animateButton(event);
}

// Clear all data
function clearScreen() {
    currentInput = '0';
    preview.innerText = '';
    updateDisplay();
    animateButton(event);
}

// Delete last typed element
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
    updatePreview();
    animateButton(event);
}

// Handle real-time display update
function updateDisplay() {
    let visualInput = currentInput
        .replace(/\*/g, ' × ')
        .replace(/\//g, ' ÷ ')
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' − ')
        .replace(/%/g, ' % ');
    
    screen.innerText = visualInput;
    
    if (visualInput.length > 14) {
        screen.classList.add('shrink');
    } else {
        screen.classList.remove('shrink');
    }
}

// Live Result Preview Logic
function updatePreview() {
    try {
        const lastChar = currentInput.trim().slice(-1);
        if (['+', '-', '*', '/', '%'].includes(lastChar) || currentInput === '0') {
            preview.innerText = '';
            return;
        }
        
        let result = Function(`"use strict"; return (${currentInput})`)();
        
        if (result !== undefined && result !== Infinity && !isNaN(result)) {
            if (!Number.isInteger(result)) {
                result = parseFloat(result.toFixed(6));
            }
            preview.innerText = '= ' + result;
        } else {
            preview.innerText = '';
        }
    } catch (e) {
        preview.innerText = '';
    }
}

// Final evaluation when '=' is triggered
function calculate() {
    try {
        let result = Function(`"use strict"; return (${currentInput})`)();
        
        if (result === Infinity || isNaN(result)) {
            screen.innerText = "Error";
            currentInput = '0';
            preview.innerText = '';
            animateButton(event);
        } else {
            if (result.toString().includes('.')) {
                result = parseFloat(result.toFixed(6));
            }
            screen.innerText = result;
            preview.innerText = '';
            currentInput = result.toString();
            animateButton(event);
        }
    } catch (error) {
        screen.innerText = "Error";
        currentInput = '0';
        preview.innerText = '';
    }
}

// Button Animation
function animateButton(event) {
    if (!event) return;
    const btn = event.target.closest('.btn');
    if (!btn) return;
    
    btn.classList.remove('btn-ripple');
    void btn.offsetWidth; // Trigger reflow
    btn.classList.add('btn-ripple');
    
    // Remove class after animation
    setTimeout(() => {
        btn.classList.remove('btn-ripple');
    }, 400);
}

// Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearScreen();
    }
});

// Keyboard animation support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    let btn = null;
    
    if (key >= '0' && key <= '9') {
        btn = document.querySelector(`.btn[onclick*="'${key}'"]`);
    } else if (key === '.') {
        btn = document.querySelector(`.btn[onclick*="'.'"]`);
    } else if (key === '+') {
        btn = document.querySelector(`.btn-operator[onclick*="'+'"]`);
    } else if (key === '-') {
        btn = document.querySelector(`.btn-operator[onclick*="'-'"]`);
    } else if (key === '*') {
        btn = document.querySelector(`.btn-operator[onclick*="'*'"]`);
    } else if (key === '/') {
        btn = document.querySelector(`.btn-operator[onclick*="'/'"]`);
    } else if (key === 'Enter' || key === '=') {
        btn = document.querySelector('.btn-equal');
    } else if (key === 'Backspace') {
        btn = document.querySelector('.btn-action[onclick*="deleteLast()"]');
    } else if (key === 'Escape') {
        btn = document.querySelector('.btn-clear');
    }
    
    if (btn) {
        btn.classList.remove('btn-ripple');
        void btn.offsetWidth;
        btn.classList.add('btn-ripple');
        setTimeout(() => {
            btn.classList.remove('btn-ripple');
        }, 400);
    }
});
