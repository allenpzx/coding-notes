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

function lengthOfLongestSubstring(s) {
  let len = 0;
  for(let l = 0, r = 0; r < s.length; r++) {
    const i = s.substring(l, r).indexOf(s.charAt(r));
    if(i === -1) {
      len = Math.max(len, r - l + 1);
    }else {
      l += l
    }
  }
  return len
}

// 1. l对应遍历的子字符串的起始位置，r对应末尾位置
// 2. 固定l，用r遍历
// 3. 如果r不在map中，则把r当前遍历到的新值set到Map表中
// 4. 如果r已经在map中，说明之前出现过，有重复的值，则需要更新字符串的起始位置l
// 5. l更新中有两种情况：r对应的重复新值，在子串中（即在l到r区间里），l更新为map.get(s[r])+1即可；
// r对应的重复新值，在l之前（即不在l到r区间内），l不需要更新，因为不影响本子串，重复的字符不在本子串里。
// 总结即为：取最大 l = Math.max(map.get(s[r])+1,l)

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
