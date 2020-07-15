/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */

// 左下角开始，向右变大，向上变小
var searchMatrix = function (matrix, target) {
  if (matrix.length < 1) return false;
  let rowLength = matrix.length;
  let colLength = matrix[0].length;
  let row = rowLength - 1;
  let col = 0;

  while (row >= 0 && col < colLength) {
    if (matrix[row][col] === target) return true;
    if (matrix[row][col] > target) {
      row--;
    } else if (matrix[row][col] < target) {
      col++;
    }
  }
  return false;
};

// 右上角开始，向下变大，向左变小
var searchMatrix = function (matrix, target) {
  if (matrix.length == 0 || matrix[0].length == 0) {
    return false;
  }
  let rowLength = matrix.length;
  let colLength = matrix[0].length;
  let row = 0;
  let col = colLength - 1;

  while (row < rowLength && col >= 0) {
    if (matrix[row][col] === target) return true;
    if (matrix[row][col] > target) {
      col--;
    } else if (matrix[row][col] < target) {
      row++;
    }
  }
  return false;
};

// [
//     [1, 4, 7, 11, 15],
//     [2, 5, 8, 12, 19],
//     [3, 6, 9, 16, 22],
//     [10, 13, 14, 17, 24],
//     [18, 21, 23, 26, 30],
//   ],
// 这种方法选开始点的时候一定要选择左下角（或者右上角），向右一位值变大，向上一位值变小
// 选左上角，往右走和往下走都增大，不能选
// 选右下角，往上走和往左走都减小，不能选
// 选左下角，往右走增大，往上走减小，可选
// 选右上角，往下走增大，往左走减小，可选

var searchMatrix = function (matrix, target) {
  if (matrix.length < 1) return false;
  let rowLength = matrix.length;
  let colLength = matrix[0].length;
  let row = 0;
  if (matrix[0][0] > target || matrix[rowLength - 1][colLength - 1] < target)
    return false;

  function binarySearch(nums, target) {
    let l = 0,
      r = nums.length - 1;
    while (l <= r) {
      let mid = Math.floor((l + r) / 2);
      if (nums[mid] === target) return true;
      if (nums[mid] < target) {
        l = mid + 1;
      }
      if (nums[mid] > target) {
        r = mid - 1;
      }
    }
  }

  while (row < rowLength) {
    if (binarySearch(matrix[row], target)) {
      return true;
    }
    row++;
  }
  return false;
};

// var searchMatrix = function (matrix, target) {
//   if (matrix.length == 0 || matrix[0].length == 0) {
//     return false;
//   }

//   function recursive(matrix, x1, y1, x2, y2, xMax, yMax, target) {
//     //只需要判断左上角坐标即可
//     if (x1 > xMax || y1 > yMax) {
//       return false;
//     }

//     //x 轴代表的是列，y 轴代表的是行
//     if (x1 == x2 && y1 == y2) {
//       return matrix[y1][x1] == target;
//     }

//     let m1 = Math.ceil((x1 + x2) / 2);
//     let m2 = Math.ceil((y1 + y2) / 2);

//     if (matrix[m2][m1] === target) {
//       return true;
//     }
//     if (matrix[m2][m1] < target) {
//       // 右上矩阵
//       return (
//         recursive(matrix, m1 + 1, y1, x2, m2, x2, y2, target) ||
//         // 左下矩阵
//         recursive(matrix, x1, m2 + 1, m1, y2, x2, y2, target) ||
//         // 右下矩阵
//         recursive(matrix, m1 + 1, m2 + 1, x2, y2, x2, y2, target)
//       );
//     } else {
//       // 右上矩阵
//       return (
//         recursive(matrix, m1 + 1, y1, x2, m2, x2, y2, target) ||
//         // 左下矩阵
//         recursive(matrix, x1, m2 + 1, m1, y2, x2, y2, target) ||
//         // // 左上矩阵
//         recursive(matrix, x1, y1, m1, m2, x2, y2, target)
//       );
//     }
//   }

//   return recursive(
//     matrix,
//     0,
//     0,
//     matrix[0].length - 1,
//     matrix.length - 1,
//     matrix[0].length - 1,
//     matrix.length - 1,
//     target
//   );
// };

// console.log(searchMatrix([[1, 1]], 2));
console.log(
  searchMatrix(
    [
      [1, 4, 7, 11, 15],
      [2, 5, 8, 12, 19],
      [3, 6, 9, 16, 22],
      [10, 13, 14, 17, 24],
      [18, 21, 23, 26, 30],
    ],
    5
  )
);

// console.log(
//   searchMatrix(
//     [
//       [1, 4, 7, 11, 15],
//       [2, 5, 8, 12, 19],
//       [3, 6, 9, 16, 22],
//       [10, 13, 14, 17, 24],
//       [18, 21, 23, 26, 30],
//     ],
//     20
//   )
// );
// console.log(searchMatrix([[-5]], -10));
// console.log([[-5]][0][0])
// console.log(searchMatrix([[-1, 3]], 3));

// console.log(
//   searchMatrix(
//     [
//       [1, 2, 3, 4, 5],
//       [6, 7, 8, 9, 10],
//       [11, 12, 13, 14, 15],
//       [16, 17, 18, 19, 20],
//       [21, 22, 23, 24, 25],
//     ],
//     19
//   )
// );
