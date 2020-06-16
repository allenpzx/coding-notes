function _instanceOf(obj, fn) {
    while(obj) {
      if(obj.__proto__ === fn.prototype) return true;
      obj = obj.__proto__
    }
    return false
  }