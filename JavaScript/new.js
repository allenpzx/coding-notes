function factory(fn, ...args) {
    let o = {};
    o.__proto__ = fn.prototype;
    const res = fn.call(o, ...args);
    return res && (typeof res === 'object' || typeof res === 'function') ? res : o
  }
  
  function Person(firtName, lastName) {
    this.firtName = firtName;
    this.lastName = lastName;
  }
  
  Person.prototype.getFullName = function () {
    return `${this.firtName} ${this.lastName}`;
  };
  
  const someone1 = new Person('left', 'right');
  const someone2 = factory(Person, 'foo', 'bar');
  console.log(someone1, someone1.getFullName());
  console.log(someone2, someone2.getFullName());