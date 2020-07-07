/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// var twoSum = function(nums, target) {
//     for (let i = 0; i < nums.length; i++) {
//         for( let n = i + 1; n < nums.length; n++) {
//             if(nums[i] + nums[n] === target) {
//                 return [i, n];
//             }
//         }
//     }
    
// };

// console.time('twoSum');
// const res = twoSum([2, 7, 11, 15], 9)
// console.log(res)
// console.timeEnd('twoSum')

var twoSum = function(nums, target) {
    let memo = {};
    for (let i = 0; i < nums.length; i++) {
        const currentVal = nums[i];
        const difference = target - currentVal;
        if(memo[difference] !== undefined) {
            return [memo[difference], i]
        }
        memo[currentVal] = i
    }
    return memo
};

console.time('twoSum');
const res = twoSum([2, 7, 11, 15], 9)
console.log(res)
console.timeEnd('twoSum')