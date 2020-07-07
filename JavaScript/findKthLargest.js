var findKthLargest = function(nums, k) {
    for(let i = 1; i < nums.length; i++) {
        let preIndex = i - 1;
        let currentVal = nums[i];
        while(currentVal > nums[preIndex] && preIndex >= 0) {
            nums[preIndex + 1] = nums[preIndex];
            preIndex--;
        }
        nums[preIndex + 1] = currentVal;
    }
    return nums[k - 1]
};

console.time('findKthLargest')
const res = findKthLargest([3,2,1,5,6,4], 2)
console.log(res)
console.timeEnd('findKthLargest')