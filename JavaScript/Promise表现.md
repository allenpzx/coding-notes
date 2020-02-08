`Promise.all()`方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

**如果作为参数的`Promise实例`，如果自己定义了catch方法，那么它一旦被rejected, 先运行自己的catch方法，该方法返回一个新的`resolve`的`promise实例`，并不会触发Promise.all()的catch方法。如果参数中的`Promises实例`, 没有自己的catch方法，就会调用Promise.all()的catch方法。**

```javascript
function A() {
  return new Promise((resolve, reject) => {
    resolve("A");
  })
    .then(res => res)
    .catch(e => e);
}

function B() {
  return new Promise((resolve, reject) => {
    reject("B");
  })
    .then(res => res)
    .catch(e => e);
}

Promise.all([A(), B()])
  .then(res => {
    console.log("result: ", res);
    // result:  [ 'A', 'B' ]
  })
  .catch(error => {
    console.log("error: ", error);
  });
```


```javascript
function A2() {
  return new Promise((resolve, reject) => {
    resolve("A2");
  })
    .then(res => res)
    .catch(e => e);
}

function B2() {
  return new Promise((resolve, reject) => {
    reject("B2");
  })
    // .then(res => res)
    // .catch(e => e);
}

Promise.all([A2(), B2()])
  .then(res => {
    console.log("result2: ", res);
  })
  .catch(error => {
    console.log("error2: ", error);
    // error2:  B2
  });
```