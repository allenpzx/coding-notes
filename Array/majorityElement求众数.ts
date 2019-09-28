/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums: number[]): number {
  // return Object.entries(nums.reduce((prev, v) => {
  //     Reflect.has(prev, v) ? prev[v]++ : Reflect.set(prev, v, 1)
  //     return prev
  // }, {})).sort((a, b)=>b[1] - a[1])[0][0]
  let count = 0;
  let majority = nums[0];

  for (let i = 0; i < nums.length; i++) {
    if (count === 0) {
      majority = nums[i];
    }
    if (majority === nums[i]) {
      count++;
    } else {
      count--;
    }
  }
  return majority;
};
