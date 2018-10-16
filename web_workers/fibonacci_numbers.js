/**
* Generates Fibonacci Numbers using a separate thread while 
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

// Web Worker work - creating Fibonacci numbers
const fibonacciNumberWorker = () => createWorker((event) => {
  let nthFibonacciNumber = (nthTerm) => {
    if (nthTerm == 1) {
      return 1;
    }
    else if (nthTerm == 2) {
      return 1;
    }
    
    return nthFibonacciNumber(nthTerm - 1) + 
      nthFibonacciNumber(nthTerm - 2);
  };
  
  self.postMessage(nthFibonacciNumber(event.data));
});

// Main thread work
let runNumber = 0;
window.setInterval(() => {
  runNumber += 1;
  document.getElementById('textfield').innerHTML = `Interval run - ${runNumber}`;
}, 100)

// Fibonacci Number generation on a separate worker!
let currentWorker = null;
document.getElementById('generateFibonacci').addEventListener("click", () => {
  if (currentWorker) {
    currentWorker.terminate();
  }
  
  const nthTerm = Number(document.getElementById('generateFibonacciField').value);
  if (Number.isNaN(nthTerm)) {
    return;
  }
  
  currentWorker = fibonacciNumberWorker();
  currentWorker.postMessage(nthTerm);
  
  let workerListener = (event) => {
    console.log(event.data);
    if (currentWorker) {
      currentWorker.terminate();
    }
    currentWorker.removeEventListener("message", workerListener);
  };
  currentWorker.addEventListener("message", workerListener);
});
// Fibonacci Number generation on same main thread. Booooo!!!
document.getElementById('generateFibonacciNoworker').addEventListener("click", () => {  
  const nthTerm = Number(document.getElementById('generateFibonacciFieldNoworker').value);
  if (Number.isNaN(nthTerm)) {
    return;
  }
  
  let nthFibonacciNumber = (nthTerm) => {
    if (nthTerm == 1) {
      return 1;
    }
    else if (nthTerm == 2) {
      return 1;
    }
    
    return nthFibonacciNumber(nthTerm - 1) + nthFibonacciNumber(nthTerm - 2);
  };
  
  console.log(nthFibonacciNumber(nthTerm));
});
