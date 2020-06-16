Function.prototype._call = function (context, ...args) {
  const ctx = context || window;
  const fnKey = Symbol();
  ctx[fnKey] = this;
  const res = ctx[fnKey](...args);
  delete ctx[fnKey];
  return res;
};

Function.prototype._apply = function (context, args) {
  const ctx = context || window;
  const fnKey = Symbol();
  ctx[fnKey] = this;
  const res = ctx[fnKey](...args);
  delete ctx[fnKey];
  return res;
};

Function.prototype._bind = function (context, ...args) {
  const fn = this;
  function fBound(...argus) {
    const ctx = this instanceof fBound ? this : context || window;
    const fnKey = Symbol();
    ctx[fnKey] = fn;
    const res = ctx[fnKey](...args, ...argus);
    delete ctx[fnKey];
    return res;
  }
  fBound.prototype = fn.prototype;
  return fBound;
};
