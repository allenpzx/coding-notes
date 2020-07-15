/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
  for (let i = 0; i < k; i++) {
    nums.unshift(nums.pop());
  }
  return nums;
};

var rotate = function (nums, k) {
  nums.splice(0, 0, ...nums.splice(nums.length - k));
  return nums;
};

// 暴力法
var rotate = function (nums, k) {
  const n = nums.length;
  for (let i = 0; i < k; i++) {
    for (let r = 0; r < n; r++) {
      const memo = nums[r];
      nums[r] = nums[n - 1];
      nums[n - 1] = memo;
    }
  }
  return nums;
};



// 三次反转法
// 原始数组                  : 1 2 3 4 5 6 7
// 反转所有数字后             : 7 6 5 4 3 2 1
// 反转前 k 个数字后          : 5 6 7 4 3 2 1
// 反转后 n-k 个数字后        : 5 6 7 1 2 3 4 --> 结果
var rotate = function (nums, k) {
    const reverse = function (arr, l, r) {
        while(l < r) {
            let temp = arr[l];
            arr[l] = arr[r];
            arr[r] = temp;
            l++;
            r--;
        }
    }
    const len = nums.length
    const i = k % nums.length; // 用余数是因为可能 k 比 nums.length 要大
    reverse(nums, 0, len - 1);
    reverse(nums, 0, i - 1);
    reverse(nums, i, len - 1);
    return nums
}

console.log(rotate([1, 2, 3, 4, 5, 6, 7], 3));
console.log(rotate([-1, -100, 3, 99], 2));
console.log(rotate([-1], 2));

