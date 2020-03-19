// 手写简单实现一些方法

// instanceof
function _instanceof(left, right) {
  if(!left) return false
  if(left.__proto__ === right.prototype) return true
  return _instanceof(left.__proto__, right)
}

// new
function factory(fn, ...args) {
  let o = {};
  o.__proto__ = fn.prototype;
  fn.call(o, ...args);
  return o;
}

// Object.create
function _create(proto, propertiesObject) {
  let n = {};
  n.__proto__ = proto;
  propertiesObject && Object.defineProperties(n, propertiesObject);
  return n;
}

// call
Function.prototype._call = function(context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype._call - what is trying to be bound is not callable"
    );
  }
  const ctx = context || window;
  ctx.fn = this;
  const result = ctx.fn(...args);
  delete ctx.fn;
  return result;
};

// apply
Function.prototype._apply = function(context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError(
      "Function.prototype._apply - what is trying to be bound is not callable"
    );
  }
  const ctx = context || window;
  ctx.fn = this;
  const result = ctx.fn(...args[0]);
  delete ctx.fn;
  return result;
};

// bind
Function.prototype._bind = function(context, ...args) {
  const ctx = context || window;
  const _this = this;
  function fn() {}
  function result(...argus) {
    return _this.apply(this instanceof result ? this : ctx, [
      ...args,
      ...argus
    ]);
  }
  if (this.prototype) {
    fn.prototype = this.prototype;
  }
  result.prototype = new fn();
  return result;
};

// flat
const flat = arr =>
  arr.reduce(
    (prev, curr) => prev.concat(Array.isArray(curr) ? flat(curr) : curr),
    []
  );

// deepClone
function cloneDeep(target, store = new Map()) {
  if (store.get(target)) return target;
  let result;
  const needRecursive = tar =>
    Array.isArray(tar) || (tar instanceof Object && tar.constructor === Object);

  if (needRecursive(target)) {
    store.set(target, target);
    result = Array.isArray(target) ? [] : {};
    for (let i in target) {
      if (target.hasOwnProperty(i)) {
        const val = target[i];
        result[i] = needRecursive(val) ? cloneDeep(val, store) : val;
      }
    }
  }
  return result || target;
}

// 查找叶子节点
function queryChilds(target) {
  let results = [];

  const needRecursive = tar =>
    Array.isArray(tar) ||
    (tar instanceof Object && tar.constructor === Object);

  if (needRecursive(target)) {
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        const value = target[key];
        results = results.concat(
          needRecursive(value) ? queryChilds(value) : value
        );
      }
    }
  } else {
    results = results.concat(target);
  }

  return results;
}

function _debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log(this);
      fn.apply(this, args);
    }, delay);
  };
}

function _throttle(fn, limit) {
  let timer = null;
  return (...args) => {
    if (timer) return;
    fn();
    timer = setTimeout(() => {
      fn();
      clearTimeout(timer);
    }, limit);
  };
}

function cloneDeep(target, store = new Map()) {
  if (store.has(target)) return store.get(target);
  let result = target;

  const needRecursive = tar =>
    Array.isArray(tar) || (tar instanceof Object && tar.constructor === Object);

  if (needRecursive(target)) {
    store.set(target, result);
    result = Array.isArray(target) ? [] : {};
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        const value = target[key];
        result[key] = needRecursive(value) ? cloneDeep(value, store) : value;
      }
    }
  }
  return result;
}

// 查找叶子节点
function queryChilds(target) {
  let results = [];

  const needRecursive = tar =>
    Array.isArray(tar) || (tar instanceof Object && tar.constructor === Object);

  if (needRecursive(target)) {
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        const value = target[key];
        results = results.concat(
          needRecursive(value) ? queryChilds(value) : value
        );
      }
    }
  } else {
    results = results.concat(target);
  }

  return results;
}
