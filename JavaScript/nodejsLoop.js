/**
 * timer(setTimeout setInterval) -- tick(process.nextTick promise.then) -- I/O -- tick(process.nextTick promise.then) -- check(setImmediate)
 */

// 👇 random console
// setTimeout的回调函数在1阶段执行，setImmediate的回调函数在3阶段执行。event loop先检测1阶段，这个是正确的，官方文档也说了The event loop cycle is timers -> I/O -> immediates, rinse and repeat. 但是有个问题就是进入第一个event loop时间不确定，不一定就是从头开始进
// 入的，上面的例子进入的时间并不完整。网上有人总结，当进入event loop的
// 时间低于1ms，则进入check阶段，也就是3阶段，调用setImmediate，如果超过1ms，则进入的是timer阶段，也就是1阶段，回调setTimeout的回调函数。

// setTimeout(() => {
//   console.log("setTimeout");
// }, 0);

// setImmediate(() => {
//   console.log("setImmediate");
// });

// 👇 next tick will always first
// process.nextTick(() => {
//   console.log("nextTick");
// });
// setImmediate(function() {
//   console.log("immediate");
// });

// 👇 setImmediate first
// timer -- I/O -- check。这三个阶段是event loop的执行顺序，当fs读取文件时，我们已经将setTimeout和setImmediate注册在event loop中了，当fs文件流读取完毕，执行到了I/O阶段，然后去执行check阶段，执行setImmediate的回调函数，然后去下一次轮询的时候进入到timer阶段执行setTimeout。

// const fs = require("fs");
// fs.readFile(__filename, () => {
//   setTimeout(() => {
//     console.log("setTimeout");
//   }, 0);

//   setImmediate(() => {
//     console.log("setImmediate");
//   });
// });

// 👇 never output
// 因为process.nextTick是注册在tick阶段的，回调的仍然是process.nextTick方法，但是process.nextTick不是注册在下一个轮询的tick阶段，而是在当前的tick阶段进行拼接，继续执行，从而导致了死循环，event loop根本没机会进入到timer阶段

// setInterval(() => {
//   console.log("setInterval");
// }, 100);

// process.nextTick(function tick() {
//   process.nextTick(tick);
// });

// 👇
// setImmediate1
// setImmediate3
// nextTick
// setImmediate2

// setImmediate(() => {
//   console.log("setImmediate1");
//   setImmediate(() => {
//     console.log("setImmediate2");
//   });
//   process.nextTick(() => {
//     console.log("nextTick");
//   });
// });
// setImmediate(() => {
//   console.log("setImmediate3");
// });

// 👇 promise.then也是注册在tick阶段的，但是process.nextTick的优先级高于promise，故而先调用process.nextTick
// const promise = Promise.resolve();
// promise.then(() => {
//   console.log("promise");
// });
// process.nextTick(() => {
//   console.log("nextTick");
// });

// 👇
// 2 3 5 4 1
// setTimeout(() => {
//   console.log(1);
// }, 0);
// new Promise((resolve, reject) => {
//   console.log(2);
//   for (let i = 0; i < 10000; i++) {
//     i === 9999 && resolve();
//   }
//   console.log(3);
// }).then(() => {
//   console.log(4);
// });
// console.log(5);
