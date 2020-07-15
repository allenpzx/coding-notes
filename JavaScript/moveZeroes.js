var moveZeroes = function (nums) {
    let index = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] !== 0) {
        nums[index++] = nums[i]
      }
    }
    for(let i = index; i < nums.length; i++) {
      nums[i] = 0;
    }
    return nums;
  };
  
  let arr1 = [0, 1, 0, 3, 12];
  let arr2 = [0, 1, 0];
  console.log(moveZeroes(arr1));
  console.log(moveZeroes(arr2));