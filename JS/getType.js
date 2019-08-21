/**
 * @param {object} 
 * @return {string}
 */

function getType(obj) {
  return Object.prototype.toString
    .call(obj)
    .match(/\s[a-zA-Z]+/)[0]
    .toLowerCase();
}
