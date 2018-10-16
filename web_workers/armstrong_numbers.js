/**
* Generates Armstrong Numbers using a separate thread while 
*   the main thread is doing some type of work
*/

function createWorker(executorFunction, workerId = null) {
  const workerExecutionBody = [
    'self.onmessage = ', executorFunction.toString().trim(), ';'
  ];
  const blob = new Blob(workerExecutionBody, {
    type: 'text/javascript'
  });

  return new Worker(URL.createObjectURL(blob));
}

// Web Worker work - creating Armstrong numbers
const armstrongNumberWorker = createWorker(() => {
  let currentNumber = 1;
  
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
      // Send a message back to the main thread
      self.postMessage(currentNumber);
    }
    
    currentNumber += 1;
  }
});

// Event handler on the main thread
armstrongNumberWorker.addEventListener(
  "message", (event) => {
     window.document.getElementById('armstrongnumber').innerHTML = `Current Armstrong Number: ${event.data}`;
  }
);

// Main thread work
let runNumber = 0;
window.setInterval(() => {
  runNumber += 1;
  document.getElementById('textfield').innerHTML = `Interval run - ${runNumber}`;
}, 100)

// Start the Armstrong Number generation!
armstrongNumberWorker.postMessage(null);
