/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    let row = matrix.length;
    if(row === 0) return false
    let col = matrix.slice(-1)[0].length;
    if(col === 0) return false
    
    let i = 0;
    let r = row - 1;
    while(r >= 0 && i < col) {
      if(matrix[r][i] === target) return true
      if(matrix[r][i] < target) {
        i++
      }else {
        r--
      }
    }
    return false
};