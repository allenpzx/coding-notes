/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  if (s.length < 2) return s.length;
  let memo = [];
  for (let i = 0; i < s.length; i++) {
    let result = `${s[i]}`;
    for (let n = i + 1; n <= s.length; n++) {
      if (result.indexOf(s[n]) === -1) {
        const str = s.substring(i, n + 1);
        result = str;
      } else {
        memo.push(result);
        break;
      }
    }
    memo.push(result);
  }
  let max = 0;
  for (let i = 0; i < memo.length; i++) {
    if (memo[i].length > max) {
      max = memo[i].length;
    }
  }
  return max;
};

console.time("lengthOfLongestSubstring");
const res = lengthOfLongestSubstring("abcabcbb");
const res2 = lengthOfLongestSubstring("pwwkew");
const res3 = lengthOfLongestSubstring(" ");
const res4 = lengthOfLongestSubstring("");
const res5 = lengthOfLongestSubstring("au");
const res6 = lengthOfLongestSubstring("aab");
const res7 = lengthOfLongestSubstring("dvdf");
console.log(res, res2, res3, res4, res5, res6, res7);
console.timeEnd("lengthOfLongestSubstring");

function pad(str) {
    return Array(str.length - 4).fill('#').join('') + str.substring(str.length - 4)
//   return str.substring(str.length - 4).padStart(str.length - 4, "#");
}

console.log(pad("123456"));
