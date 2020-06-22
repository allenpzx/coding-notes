function debounce(fn, limit, leading = false) {
  let timer = null;
  return function (...args) {
    if (!leading) {
      clearTimeout(timer);
      setTimeout(() => {
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
