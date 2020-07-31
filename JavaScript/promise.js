class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(fn) {
    this.status = MyPromise.PENDING;
    this.fn = fn;
    this.bindMethods();
    this.init();
  }

  init() {
    try {
      this.fn(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }

  bindMethods() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
    this.then = this.then.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(props) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;

      if (this.resolveFn) {
        const res = this.resolveFn(props);
        // console.log(res, this, "========");
        if (res && res.constructor === MyPromise) {
          res.then(this.resolveFnDefer, this.rejectFnDefer);
          return "";
        }
        if (res && res.constructor !== MyPromise) {
          this.resolveFnDefer(res);
        }
      }
    }
  }

  reject(props) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;

      if (this.rejectFn) {
        const res = this.rejectFn(props);
        if (res && res.constructor === MyPromise) {
          res.then(this.resolveFnDefer, this.rejectFnDefer);
          return "";
        }
        if (res && res.constructor !== MyPromise) {
          this.resolveFnDefer(res);
        }
      }
    }
  }

  then(onFulfilled, onRejected) {
    this.resolveFn = onFulfilled;
    this.rejectFn = onRejected;
    let newPromise = new MyPromise(() => {});
    this.resolveFnDefer = newPromise.resolve.bind(newPromise);
    this.rejectFnDefer = newPromise.reject.bind(newPromise);
    return newPromise;
  }
}

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("timeout");
    resolve(1);
  }, 1000);
})
  .then((res) => {
    console.log("then 1: ", res);
    return 2;
  })
  .then((res) => {
    console.log("then 2: ", res);
    return new MyPromise((resolve) => {
      setTimeout(() => resolve(3), 1000);
    });
  })
  .then((res) => {
    console.log("then 3: ", res);
    return new MyPromise((resolve, reject) => {
      setTimeout(() => reject(4), 1000);
    });
  })
  .then(
    (res) => {
      console.log("then 4: ", res);
    },
    (error) => {
      console.log("error: ", error);
    }
  );
