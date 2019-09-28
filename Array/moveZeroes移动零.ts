/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums: number[]): void {
  let start = 0;
  let end = nums.length - 1;
  while (start < end) {
    if (nums[start] === 0) {
      nums.push(0);
      nums.splice(start, 1);
      end--;
      continue;
    }
    start++;
  }
};
