function partition(s) {
  const res = [],
    arr = [];

  function isPalindrome(i, j) {
    for (; i < j; ) {
      if (s[i] !== s[j]) {
        return false;
      }
      i++;
      j--;
    }
    return true;
  }

  function loop(left, right) {
    if (left === s.length) {
      return res.push(arr.slice());
    }
    if (right > s.length) return;
    if (isPalindrome(left, right - 1)) {
      arr.push(s.slice(left, right));
      loop(right, right + 1);
      arr.pop();
    }
    loop(left, right + 1);
  }

  loop(0, 1);
  return res;
}
