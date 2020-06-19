function fibonacci(n) {
  if (n === 0 || n === 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function fibonacciMemo(n) {
  let memo = {};
  let loop = (num) => {
    if (memo[num]) return memo[num];
    if (num === 0 || num === 1) return num;
    let left = loop(num - 1),
      right = loop(num - 2);
    const res = left + right;
    memo[num - 1] = left;
    memo[num - 2] = right;
    memo[num] = res;
    return res;
  };
  return loop(n);
}

console.time("fibonacci");
console.log(fibonacci(40));
console.timeEnd("fibonacci");

console.time("fibonacciMemo");
console.log(fibonacciMemo(40));
console.timeEnd("fibonacciMemo");
