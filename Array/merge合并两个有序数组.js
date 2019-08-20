/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    let s1 = nums1.slice(0, m);
    let s2 = nums2.slice(0, n);
    [...s1, ...s2].sort((a, b)=>a-b).map((v, k) => nums1[k] = v);
};