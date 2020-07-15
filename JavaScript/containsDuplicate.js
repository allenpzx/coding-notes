/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    for(let i = 0; i < nums.length - 1; i++) {
        for(let n = i + 1; n < nums.length; n++) {
            if(nums[i] === nums[n]) {
                return true
            }
        }
    }
    return false
};

var containsDuplicate = function(nums) {
    let memo = {}
    for(let i = 0; i < nums.length; i++) {
        const val = nums[i];
        if(memo[val]) return true
        memo[val] = 1
    }
    return false
};

var containsDuplicate = function(nums) {
    nums.sort()
    for(let i = 0; i < nums.length; i++) {
        if(nums[i + 1] === nums[i]) {
            return true
        }
    }
    return false
};

console.log(containsDuplicate([3,1]))
console.log(containsDuplicate([]))
console.log(containsDuplicate([1,2,3,1]))