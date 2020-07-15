// function maxProduct(nums) {
//   let max = nums[0]
//   let maxMemo = [max];
//   let minMemo = [max];

//   for(let i = 1; i < nums.length; i++) {
//     maxMemo[i] = Math.max(nums[i], nums[i] * maxMemo[i - 1], nums[i] * minMemo[i - 1]);
//     minMemo[i] = Math.min(nums[i], nums[i] * maxMemo[i - 1], nums[i] * minMemo[i - 1]);
//     max = Math.max(max, maxMemo[i]);
//   }
//   return max
// }

function maxProduct(nums) {
  let max = 0,
    imax = 1;
  imin = 1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) {
      const memo = imax;
      imax = imin;
      imin = memo;
    }
    imax = Math.max(nums[i], imax * nums[i]);
    imin = Math.min(nums[i], imin * nums[i]);
    max = Math.max(max, imax);
  }
  return max;
}

console.log(maxProduct([2, 3, -2, 4]), "result");
