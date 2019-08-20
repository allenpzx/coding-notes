/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    return s.replace(/[^0-9a-z]/gi, '').toLowerCase().split('').every((item, i, arr)=>item === arr[arr.length-1-i])
};