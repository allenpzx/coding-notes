/**
 * @param {number[]} nums
 * @return {number[][]}
 */

function permute(nums) {
  let result = [];
  let loop = (path) => {
    if (path.length === nums.length) {
      return result.push(path.slice());
    }
    for (let i = 0; i < nums.length; i++) {
      if (path.indexOf(nums[i]) === -1) {
        path.push(nums[i]);
        loop(path);
        path.pop();
      }
    }
  };
  loop([]);
  return result;
}

let arr = [1, 2, 3];

console.time("permute");
console.log(permute(arr));
console.timeEnd("permute");

function permute2(nums) {
  const change = (arr, left, right) => {
    let temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
  };
  const loop = (arr, p, q, res) => {
    if (p === q) {
      res.push(arr.slice());
    } else {
      for (let i = p; i <= q; i++) {
        change(arr, p, i);
        loop(arr, p + 1, q, res);
        change(arr, p, i);
      }
    }
  };
  let result = [];
  loop(nums, 0, nums.length - 1, result);
  return result;
}

console.time("permute2");
console.log(permute2(arr));
console.timeEnd("permute2");
