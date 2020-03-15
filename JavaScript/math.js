// console.log(Math.random())
// console.log(Math.ceil(Math.random())) // to up
// console.log(Math.floor(Math.random())) // to down
// console.log(Math.round(Math.random())) // up or down

// [n, m]
function getRandom(left, right) {
    return Math.round((Math.random() * (right - left)) + left)
}

// (n , m)
function getRandom2(left, right) {
    left +=1;
    right -=1;
    return Math.round((Math.random() * (right - left)) + left)
}

// [n , m)
function getRandom3(left, right) {
    return Math.floor((Math.random() * (right - left)) + left)
}

// (n , m]
function getRandom4(left, right) {  
    return Math.ceil((Math.random() * (right - left)) + left)
}

// 取整
function trunc(num) {
    return num > 0 ? Math.floor(num) : Math.ceil(num)
}

// function trunc(num) {
//     return num - num % 1;
// }

// 取小数
function fract(num) {
    return num - trunc(num);
}

console.log(3.75 % 1); // 0.75
console.log(-3.75 % 1); // -0.75
console.log(3.22 % 1)
console.log((3.22 % 1).toFixed(2))

console.log(trunc(3.75))
console.log(trunc(-3.75))
console.log(fract(3.75))
console.log(fract(-3.75))

let a = Infinity;

console.log(a === a - 1); // true

let b = -Infinity;

console.log(b === b - 1);  // true

console.log(Infinity + Infinity); // Infinity
console.log(Infinity - Infinity); // NaN
console.log(Infinity * Infinity); // Infinity
console.log(Infinity / Infinity); // NaN
console.log(Infinity * 0); // NaN