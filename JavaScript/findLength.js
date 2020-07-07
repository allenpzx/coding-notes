/**
 * @param {number[]} A
 * @param {number[]} B
 * @return {number}
 */
var findLength = function (A, B) {
    let result = [];
    if(A.slice().join('') === B.slice().join('')) return A.length
    for(let i = 0; i < A.length; i++) {
        for(let n = 0; n < B.length; n++) {
            if(A[i] !== B[n]) {
                continue
            }
            let len = 2;
            while(A[i] === B[n] && A.slice(i, i + len).join('') === B.slice(n, n + len).join('')) {
                if(A.slice(i, i + len).length > result.length) {
                    result = A.slice(i, i + len)
                }
                len++
            }
        }
    }
    return result.length
};

console.time("findLength");
console.log(findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]));
console.log(findLength([0,0,0,0,0], [0,0,0,0,0]));
console.log(findLength([0,1,1,1,1], [1,0,1,0,1]));
console.timeEnd("findLength");
