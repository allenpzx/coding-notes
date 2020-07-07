// var merge = function(A, m, B, n) {
//     for(let i = 0; i < n; i++) {
//         A[i + m] = B[i]
//     }
//     for(let i = 0; i < m + n - 1; i++) {
//         let index = i;
//         let x = i + 1;
//         while(x < m + n) {
//             if(A[x] < A[index]) {
//                 index = x;
//             }
//             x++
//         }
//         let memo = A[i];
//         A[i] = A[index];
//         A[index] = memo;
//     }
//     return A
// };

// A = [1,2,3,0,0,0], m = 3
// B = [2,5,6],       n = 3

// console.time('merge');
// const res = merge(A, m, B, n);
// console.log(res)
// console.timeEnd('merge')

// var merge = function(A, m, B, n) {
//     for(let i = 0; i < n; i++) {
//         A[i + m] = B[i]
//     }
//     for(let i = 1; i < m + n; i++) {
//         let preIndex = i - 1;
//         let currentVal = A[i];
//         while(currentVal < A[preIndex] && preIndex >=0) {
//             A[preIndex + 1] = A[preIndex]
//             preIndex--
//         }
//         A[preIndex + 1] = currentVal;
//     }
//     return A
// };

// A = [1,2,3,0,0,0], m = 3
// B = [2,5,6],       n = 3

// console.time('merge');
// const res = merge(A, m, B, n);
// console.log(res)
// console.timeEnd('merge')

var merge = function(nums1, m, nums2, n) {
    let nums1Index = m - 1;
    let nums2Index = n - 1;
    let index = m + n - 1;
    while(nums1Index >= 0 && nums2Index >= 0) {
        nums1[index--] = nums1[nums1Index] > nums2[nums2Index] ? nums1[nums1Index--] : nums2[nums2Index--];
    }
    return nums1
};

A = [1,2,3,0,0,0], m = 3
B = [2,5,6],       n = 3

console.time('merge');
const res = merge(A, m, B, n);
console.log(res)
console.timeEnd('merge')