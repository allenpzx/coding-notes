class A {
  constructor(value) {
    this.value = value;
  }
  valueOf() {
    return this.value++;
  }
}

const a = new A(1);
if (a == 1 && a == 2 && a == 3) {
  console.log("Hi a!"); // will do this
}

if (a === 1 && a === 2 && a === 3) {
  console.log("Hi a 2!"); // never do this
}

const d = {
  i: 1,
  valueOf() {
    return this.i++;
  }
};
if (d == 1 && d == 2 && d == 3) {
  console.log("Hi D");
}

/**
 * @description 👆这种利用了计算的时候用 valueOf 或 toString 的返回值来计算， 当 valueOf 返回非基本数据类型的时候会用 toString 的返回值
 */

var value = 0;
Object.defineProperty(global, "b", {
  get() {
    return ++value;
  }
});

if (b === 1 && b === 2 && b === 3) {
  console.log("Hi b");
}

/**
 * @description 👆这种利用了属性劫持
 */

var cﾠ = 1;
var c = 2;
var ﾠc = 3;
if (cﾠ == 1 && c == 2 && ﾠc == 3) {
  console.log("Hi c!");
}

/**
 * @description 👆这是三个不一样的c，a 后面放一个或者两个红点实现，并在回车的时候，调试工具会把这些痕迹给隐藏
 */

console.log("             ");

/**
 * 1. 当 Boolean 类型与 Number 类型比较，Boolean 类型的值会被转换为 Number 类型
 * 2. 当 String 类型和 Number 类型比较， String 类型的值会被转换为 Number 类型
 * 3. 当 Object 和 原始 类型做相等比较时， Object 会依照 ToPrimitive 规则转换为原始类型
 * 4. null 和 undefined 之间互相宽松相等（==），并且也与其自身相等，但和其他所有的值都不宽松相等（==）
 * 5. 隐式转换 valueOf() 方法返回值优先，如果返回值非原始对象，则采用 toString() 返回值
 */

console.log("Boolean with Number 1", false == 0); // true
console.log("Boolean with Number 2", true == 1); // true
console.log("Boolean with Number 3", true == 2); // false

console.log("             ");

console.log("String with Number 1", 0 == "");
console.log("String with Number 2", 1 == "1");
console.log("String with Number 3", 1e21 == "1e21");
console.log("String with Number 4", Infinity == "Infinity");
console.log("String with Number 5", true == "1");
console.log("String with Number 6", false == "0");
console.log("String with Number 7", false == "");

console.log("             ");

console.log('Special 1', null == undefined);
console.log('Special 2', null == false);
console.log('Special 3', undefined == false);
console.log('Special 4', null == 0);
console.log('Special 5', undefined == 0);
console.log('Special 6', [null] == 0);
console.log('Special 7', [undefined] == 0);
console.log('Special 8', null == null);
console.log('Special 9', undefined == undefined);