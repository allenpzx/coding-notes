function debounce(fn, limit, leading = false) {
  let timer = null;
  return function (...args) {
    if (!leading) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.call(this, ...args);
      }, limit);
    }
    if (leading && !timer) {
      fn.call(this, ...args);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      });
    }
    if (leading && timer) {
      clearTimeout(timer);
      timer = null;
      setTimeout(() => {
        fn.call(this, ...args);
      }, limit);
    }
  };
}

function throttle(fn, limit) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      fn.call(this, ...args);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, limit);
    }
  };
}


function log() {
    console.log('log ' + new Date().getSeconds());
}

const withDebounce = debounce(log, 2000);
const withThrottle = throttle(log, 2000);

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function loop() {
    withDebounce()
    await delay(1000)
    withDebounce()
    await delay(1000)
    withDebounce()
    await delay(2000)
    withDebounce()
}

// loop()

function machine() {
    setInterval(withThrottle, 500);
}

// machine()