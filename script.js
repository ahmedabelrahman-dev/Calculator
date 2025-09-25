const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let error = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputDigit(digit) {
  if (error) return;
  if (waitingForSecondOperand) {
    currentInput = digit;
    waitingForSecondOperand = false;
  } else {
    if (currentInput.length >= 12) return;
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (error) return;
  if (waitingForSecondOperand) {
    currentInput = '0.';
    waitingForSecondOperand = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function handleOperator(nextOperator) {
  if (error) return;
  const inputValue = parseFloat(currentInput);
  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }
  if (firstOperand == null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation(operator, firstOperand, inputValue);
    if (result === 'Error') {
      currentInput = 'Error';
      error = true;
      updateDisplay();
      return;
    }
    currentInput = String(result).slice(0, 12);
    firstOperand = result;
  }
  operator = nextOperator;
  waitingForSecondOperand = true;
  updateDisplay();
}

function performCalculation(op, a, b) {
  switch (op) {
    case 'add': return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide': return b === 0 ? 'Error' : a / b;
    default: return b;
  }
}

function handleEquals() {
  if (error || operator == null) return;
  const inputValue = parseFloat(currentInput);
  const result = performCalculation(operator, firstOperand, inputValue);
  if (result === 'Error') {
    currentInput = 'Error';
    error = true;
    updateDisplay();
    return;
  }
  currentInput = String(result).slice(0, 12);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function handleClear() {
  currentInput = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  error = false;
  updateDisplay();
}

function handleBackspace() {
  if (error) return;
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay();
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.number) {
      inputDigit(btn.dataset.number);
    } else if (btn.dataset.action) {
      switch (btn.dataset.action) {
        case 'decimal':
          inputDecimal();
          break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
          handleOperator(btn.dataset.action);
          break;
        case 'equals':
          handleEquals();
          break;
        case 'clear':
          handleClear();
          break;
        case 'backspace':
          handleBackspace();
          break;
      }
    }
  });
});

// Keyboard support
window.addEventListener('keydown', e => {
  if (error && e.key !== 'c' && e.key !== 'C') return;
  if (e.key >= '0' && e.key <= '9') {
    inputDigit(e.key);
  } else if (e.key === '.') {
    inputDecimal();
  } else if (e.key === '+') {
    handleOperator('add');
  } else if (e.key === '-') {
    handleOperator('subtract');
  } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
    handleOperator('multiply');
  } else if (e.key === '/' || e.key === '÷') {
    handleOperator('divide');
  } else if (e.key === '=' || e.key === 'Enter') {
    handleEquals();
  } else if (e.key === 'c' || e.key === 'C') {
    handleClear();
  } else if (e.key === 'Backspace') {
    handleBackspace();
  }
});

updateDisplay();
