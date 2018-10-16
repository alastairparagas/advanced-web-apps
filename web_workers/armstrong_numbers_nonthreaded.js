/**
* Generates Armstrong Numbers in the main thread
*/
let currentNumber = 1;

// Main thread work - notice everything runs on main thread
window.setInterval(() => {
  console.log('Interval run - 100ms elapsed');
}, 100)

while (true) {
  // Convert a number to a list of digits
  const digitArray = currentNumber
  .toString()
  .split('')
  .map(digitChar => Number(digitChar));

  // Cube each digit and add them up
  const cubedAddResult = digitArray
  .map(digit => Math.pow(digit, 3))
  .reduce((acc, current) => acc + current, 0);

  if (cubedAddResult === currentNumber) {
    document.getElementById('armstrongnumber').innerHTML = `Current Armstrong Number: ${currentNumber}`;
  }

  currentNumber += 1;
}
