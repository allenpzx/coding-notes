function singleNumber(nums) {
  let obj = {};
  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    if (obj[val]) {
      delete obj[val];
    } else {
      obj[val] = 1;
    }
  }
  for (let i of Object.keys(obj)) {
    return i;
  }
}

console.time("singleNumber");
const res = singleNumber([4, 1, 2, 1, 2]);
const res2 = singleNumber([2, 2, 1]);
console.log(res, res2);
console.timeEnd("singleNumber");

// 既满足时间复杂度又满足空间复杂度，就要提到位运算中的异或运算 XOR，主要因为异或运算有以下几个特点：
// 一个数和 0 做 XOR 运算等于本身：a⊕0 = a
// 一个数和其本身做 XOR 运算等于 0：a⊕a = 0
// XOR 运算满足交换律和结合律：a⊕b⊕a = (a⊕a)⊕b = 0⊕b = b

function singleNumber2(nums) {
    let result = 0;
    for(let i of nums) {
        result ^= i;
    }
    return result
}

console.time("singleNumber2");
const res3 = singleNumber2([4, 1, 2, 1, 2]);
const res4 = singleNumber2([2, 2, 1]);
console.log(res3, res4);
console.timeEnd("singleNumber2");
