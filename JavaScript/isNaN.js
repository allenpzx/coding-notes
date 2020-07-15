
// The global NaN property is a value (The NaN value type is number) representing Not-A-Number.
// NaN and common number also number type

// isNaN() check if the value you pass is not a number. name is not a number
// Number.isNaN() check if the value you pass is a numeric value and equal to NaN

console.log(typeof NaN) // number
console.log(NaN === NaN) // false
console.log('👇')


console.log(isNaN(NaN)); // true

console.log(isNaN('A String')); // true

console.log(isNaN(undefined)); // true

console.log(isNaN({})); // true

console.log(Number.isNaN(NaN)); // true

console.log(Number.isNaN('A String')); // false

console.log(Number.isNaN(undefined)); // false

console.log(Number.isNaN({})); // false
