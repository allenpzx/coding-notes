/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
    let result = [];
    let memo = {};
    for(let i = 0; i < nums1.length; i++) {
        for(let n = 0; n < nums2.length; n++) {
            if(nums1[i] === nums2[n] && !memo[n]) {
                memo[n] = 1;
                result.push(nums2[n])
                break
            }
        }
    }
    return result
};

var intersect = function(nums1, nums2) {
    if(nums1.length > nums2) {
        return intersect(nums2, nums1)
    }
    let result = [];
    let memo = {};
    for(let i = 0; i < nums1.length; i++) {
        memo[nums1[i]] = (memo[nums1[i]] || 0) + 1;
    }
    for(let n = 0; n < nums2.length; n++) {
        if(memo[nums2[n]]) {
            result.push(nums2[n]);
            memo[nums2[n]]-=1
        }
    }
    return result
};

var intersect = function(nums1, nums2) {
    if(nums1.length > nums2) {
        return intersect(nums2, nums1)
    }
    nums1.sort((a, b) => a - b);
    nums2.sort((a, b) => a - b);
    let len1 = nums1.length, len2 = nums2.length, index1 = 0, index2 = 0, result = [];
    while(index1 < len1 && index2 < len2) {
        if(nums1[index1] < nums2[index2]) {
           index1++ 
        }
        if(nums1[index1] > nums2[index2]) {
            index2++
        }
        if(nums1[index1] === nums2[index2]) {
            result.push(nums1[index1]);
            index1++;
            index2++;
        }
    }
    return result
};

console.log(intersect([1,2,2,1], [2,2]));
console.log(intersect([1,2,2,1], [2]));
console.log(intersect([2,1], [1,2]));
console.log(intersect([1, 2], [1, 1]));
console.log(intersect([4,9,5], [9,4,9,8,4]));