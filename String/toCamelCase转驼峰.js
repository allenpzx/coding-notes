/**
 * @param {string} argument1
 * @param {number} argument2  strat where 
 * @return {string}
 */

// function toCamelCase(str, start = 0) {
//   return str
//     .split("-")
//     .map((v, i) => {
//       if (i >= start) {
//         return v[0].toUpperCase() + v.slice(1);
//       }
//       return v;
//     })
//     .join("");
// }

function toCamelCase(str, start = 0) {
  return str.replace(/-(\w)/g, (match, matchItem) => matchItem.toUpperCase())
}
