/**
 * 
 * @param  {...fn||arg} fns from right to left
 */
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((arg, fn) => fn(arg), x);
  };
}
/**
 * 
 * @param  {...fn||arg} fns from left to right
 */
function pipe(...fns) {
  return function(x) {
    return fns.reduce((arg, fn) => fn(arg), x);
  };
}