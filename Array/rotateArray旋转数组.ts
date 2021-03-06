/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums: number[], k: number) {
    // for(let i = 0; i < k; i++) {
    //   nums.unshift(nums.pop())
    // }
    if (k < 1) return nums;
    nums.splice(0, 0, ...nums.splice(nums.length - k, k));
  };