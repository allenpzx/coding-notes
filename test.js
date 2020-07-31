let arr = [3, 5, 15, 38, 36, 26, 27, 2, 4, 44, 46, 47, 48, 50];

// function sort(arr) {
//   for (let i = 0; i < arr.length - 1; i++) {
//     for (let n = 0; n < arr.length - 1 - i; n++) {
//       if (arr[n + 1] < arr[n]) {
//         let memo = arr[n];
//         arr[n] = arr[n + 1];
//         arr[n + 1] = memo;
//       }
//     }
//   }
//   return arr;
// }

// function sort(arr) {
//   for (let i = 0; i < arr.length - 1; i++) {
//     let index = i;
//     for (let n = i + 1; n < arr.length; n++) {
//       if (arr[n] < arr[index]) {
//         index = n;
//       }
//     }
//     let memo = arr[i];
//     arr[i] = arr[index];
//     arr[index] = memo;
//   }
//   return arr;
// }

// function sort(arr) {
//   for (let i = 1; i < arr.length; i++) {
//     let preIndex = i - 1;
//     let currentVal = arr[i];
//     while (preIndex >= 0 && arr[preIndex] > currentVal) {
//       arr[preIndex + 1] = arr[preIndex];
//       preIndex--;
//     }
//     arr[preIndex + 1] = currentVal;
//   }
//   return arr;
// }

// function sort(arr) {
//   function swap(nums, l, r) {
//     let memo = nums[r];
//     nums[r] = nums[l];
//     nums[l] = memo;
//   }

//   const partition = (arr, l, r) => {
//     let pivot = arr[l];
//     while (l < r) {
//       while (l < r && arr[r] > pivot) {
//         r--;
//       }
//       while (l < r && arr[l] < pivot) {
//         l++;
//       }
//       swap(arr, l, r);
//     }
//     arr[l] = pivot;
//     return l;
//   };

//   function recursive(nums, l, r) {
//     if (l < r) {
//       const pivotIndex = partition(nums, l, r);
//       recursive(nums, 0, pivotIndex - 1);
//       recursive(nums, pivotIndex + 1, r);
//     }
//   }

//   recursive(arr, 0, arr.length - 1);
//   return arr;
// }

// // above is origin

// // function sort(nums) {
// //   for (let i = 0; i < nums.length - 1; i++) {
// //     for (let n = 0; n < nums.length - 1 - i; n++) {
// //       if (nums[n + 1] < nums[n]) {
// //         let memo = nums[n];
// //         nums[n] = nums[n + 1];
// //         nums[n + 1] = memo;
// //       }
// //     }
// //   }
// //   return nums;
// // }

// // function sort(nums) {
// //   for (let i = 0; i < nums.length - 1; i++) {
// //     let index = i;
// //     for (let n = i + 1; n < nums.length; n++) {
// //       if (nums[n] < nums[index]) {
// //         index = n;
// //       }
// //     }
// //     let memo = nums[index];
// //     nums[index] = nums[i];
// //     nums[i] = memo;
// //   }
// //   return nums;
// // }

// // function sort(nums) {
// //   for (let i = 1; i < nums.length; i++) {
// //     let preIndex = i - 1;
// //     const currentVal = nums[i];
// //     while (preIndex >= 0 && nums[preIndex] > currentVal) {
// //       nums[preIndex + 1] = nums[preIndex];
// //       preIndex--;
// //     }
// //     nums[preIndex + 1] = currentVal;
// //   }
// //   return nums;
// // }

// // function sort(nums) {
// //   let partition = (arr, l, r) => {
// //     const pivot = arr[l];
// //     while (l < r) {
// //       while (l < r && arr[r] > pivot) {
// //         r--;
// //       }
// //       while (l < r && arr[l] < pivot) {
// //         l++;
// //       }
// //       [arr[l], arr[r]] = [arr[r], arr[l]];
// //     }
// //     arr[l] = pivot;
// //     return l;
// //   };

// //   let recursive = (arr, l, r) => {
// //     if (l < r) {
// //       const pivotIndex = partition(arr, l, r);
// //       recursive(arr, 0, pivotIndex - 1);
// //       recursive(arr, pivotIndex + 1, r);
// //     }
// //   };
// //   recursive(nums, 0, nums.length - 1);
// //   return nums;
// // }

// function sort(nums) {
//   for (let i = 0; i < nums.length - 1; i++) {
//     for (let n = 0; n < nums.length - 1 - i; n++) {
//       if (nums[n + 1] < nums[n]) {
//         let temp = nums[n];
//         nums[n] = nums[n + 1];
//         nums[n + 1] = temp;
//       }
//     }
//   }
//   return nums;
// }

// function sort(nums) {
//   for (let i = 0; i < nums.length - 1; i++) {
//     let index = i;
//     for (let n = i + 1; n < nums.length; n++) {
//       if (nums[n] < nums[index]) {
//         index = n;
//       }
//     }

//     let temp = nums[index];
//     nums[index] = nums[i];
//     nums[i] = temp;
//   }
//   return nums;
// }

// function sort(nums) {
//   for (let i = 1; i < nums.length; i++) {
//     let preIndex = i - 1;
//     const currentVal = nums[i];
//     while (preIndex >= 0 && nums[preIndex] > currentVal) {
//       nums[preIndex + 1] = nums[preIndex];
//       preIndex--;
//     }
//     nums[preIndex + 1] = currentVal;
//   }
//   return nums;
// }

// function sort(nums) {
//   const partition = (arr, l, r) => {
//     let pivotIndex = l;
//     const pivot = arr[pivotIndex];
//     while (l < r) {
//       while (l < r && arr[r] > pivot) {
//         r--;
//       }
//       arr[l] = arr[r];
//       while (l < r && arr[l] <= pivot) {
//         l++;
//       }
//       arr[r] = arr[l];
//     }
//     arr[l] = pivot;
//     return l;
//   };
//   const recursive = (arr, l, r) => {
//     if (l < r) {
//       const pivot = partition(arr, l, r);
//       recursive(arr, l, pivot - 1);
//       recursive(arr, pivot + 1, r);
//     }
//   };
//   recursive(nums, 0, nums.length - 1);
//   return nums;
// }

// // function sort(nums) {
// //   let len = 3
// //   let gap = Math.floor(nums.length / 3) || 1;
// //    while (gap < len / 3) {
// //     gap = gap * 3 + 1;
// //   }
// //   while (gap > 0) {
// //     for (let i = gap; i < nums.length; i += gap) {
// //       console.log(gap)
// //       let preIndex = i - gap;
// //       let currentVal = nums[i];
// //       while (preIndex >= 0 && nums[preIndex] > currentVal) {
// //         nums[preIndex + gap] = nums[preIndex];
// //         preIndex -= gap;
// //       }
// //       nums[preIndex + gap] = currentVal;
// //     }
// //     gap = Math.floor(gap / len);
// //   }
// //   return nums
// // }

// function sort(nums) {
//   for (let i = 0; i < nums.length - 1; i++) {
//     for (let n = 0; n < nums.length - 1 - i; n++) {
//       if (nums[n + 1] < nums[n]) {
//         let temp = nums[n];
//         nums[n] = nums[n + 1];
//         nums[n + 1] = temp;
//       }
//     }
//   }
//   return nums;
// }

// function sort(nums) {
//   for (let i = 0; i < nums.length - 1; i++) {
//     let index = i;
//     for (let n = i + 1; n < nums.length; n++) {
//       if (nums[n] < nums[index]) {
//         index = n;
//       }
//     }
//     let temp = nums[i];
//     nums[i] = nums[index];
//     nums[index] = temp;
//   }
//   return nums;
// }

// function sort(nums) {
//   for (let i = 1; i < nums.length; i++) {
//     let index = i - 1;
//     let current = nums[i];
//     for (index; index >= 0 && nums[index] > current; index--) {
//       nums[index + 1] = nums[index];
//     }
//     nums[index + 1] = current;
//   }
//   return nums;
// }

// function sort(nums) {
//   const partition = (arr, l, r) => {
//     const pivotIndex = l;
//     const pivot = arr[pivotIndex];
//     while (l < r) {
//       while (l < r && arr[r] > pivot) {
//         r--;
//       }
//       while (l < r && arr[l] <= pivot) {
//         l++;
//       }
//       const temp = arr[r];
//       arr[r] = arr[l];
//       arr[l] = temp;
//     }
//     const temp = arr[l];
//     arr[l] = pivot;
//     arr[pivotIndex] = temp;
//     return l;
//   };

//   const recursive = (arr, l, r) => {
//     if (l < r) {
//       const pivot = partition(arr, l, r);
//       recursive(arr, l, pivot - 1);
//       recursive(arr, pivot + 1, r);
//     }
//   };

//   recursive(nums, 0, nums.length - 1);
//   return nums;
// }

// function sort(nums) {
//   let gap = 1;
//   while (gap < nums.length / 3) {
//     gap = gap * 3 + 1;
//   }
//   for (gap; gap > 0; gap = Math.floor(gap / 3)) {
//     for (let i = gap; i < nums.length; i++) {
//       let index = i - gap;
//       const current = nums[i];
//       for (index; index >= 0 && nums[index] > current; index -= gap) {
//         nums[index + gap] = nums[index];
//       }
//       nums[index + gap] = current;
//     }
//   }
//   return nums;
// }

// function sort(nums) {
//   for (let i = 0; i < nums.length - 1; i++) {
//     for (let n = 0; n < nums.length - 1 - i; n++) {
//       if (nums[n + 1] < nums[n]) {
//         let temp = nums[n];
//         nums[n] = nums[n + 1];
//         nums[n + 1] = temp;
//       }
//     }
//   }
//   return nums;
// }

// function sort(nums) {
//   for (let i = 0; i < nums.length - 1; i++) {
//     let index = i;
//     for (let n = i + 1; n < nums.length; n++) {
//       if (nums[n] < nums[index]) {
//         index = n;
//       }
//     }
//     let temp = nums[i];
//     nums[i] = nums[index];
//     nums[index] = temp;
//   }
//   return nums;
// }

// function sort(nums) {
//   for (let i = 1; i < nums.length; i++) {
//     const currentVal = nums[i];
//     let preIndex = i - 1;
//     for (preIndex; preIndex >= 0 && nums[preIndex] > currentVal; preIndex--) {
//       nums[preIndex + 1] = nums[preIndex];
//     }
//     nums[preIndex + 1] = currentVal;
//   }
//   return nums;
// }

// function sort(nums) {
//   let gap = 1;

//   while (gap < nums.length / 3) {
//     gap = gap * 3 + 1;
//   }

//   for (gap; gap > 0; gap = Math.floor(gap / 3)) {
//     for (let i = gap; i < nums.length; i++) {
//       let preIndex = i - gap;
//       const currentVal = nums[i];
//       for (
//         preIndex;
//         preIndex >= 0 && nums[preIndex] > currentVal;
//         preIndex -= gap
//       ) {
//         nums[preIndex + gap] = nums[preIndex];
//       }
//       nums[preIndex + gap] = currentVal;
//     }
//   }
//   return nums;
// }

function sort(nums) {
  function partition(arr, l, r) {
    const pivot = arr[l];
    while (l < r) {
      while (l < r && arr[r] > pivot) {
        r--;
      }
      arr[l] = arr[r];
      while (l < r && arr[l] <= pivot) {
        l++;
      }
      arr[r] = arr[l];
    }
    arr[l] = pivot;
    return l;
  }

  function recursive(arr, l, r) {
    if (l < r) {
      const pivotIndex = partition(arr, l, r);
      recursive(arr, l, pivotIndex - 1);
      recursive(arr, pivotIndex + 1, r);
    }
  }

  recursive(nums, 0, nums.length - 1);
  return nums;
}

function sort(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    for (let n = 0; n < nums.length - 1 - i; n++) {
      if (nums[n + 1] < nums[n]) {
        const temp = nums[n];
        nums[n] = nums[n + 1];
        nums[n + 1] = temp;
      }
    }
  }
  return nums;
}

function sort(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    let index = i;
    for (let n = i + 1; n < nums.length; n++) {
      if (nums[n] < nums[index]) {
        index = n;
      }
    }
    const temp = nums[i];
    nums[i] = nums[index];
    nums[index] = temp;
  }
  return nums;
}

function sort(nums) {
  for (let i = 1; i < nums.length; i++) {
    let preIndex = i - 1;
    const currentVal = nums[i];
    for (preIndex; preIndex >= 0 && nums[preIndex] > currentVal; preIndex--) {
      nums[preIndex + 1] = nums[preIndex];
    }
    nums[preIndex + 1] = currentVal;
  }
  return nums;
}

let count1 = 0;

function sort(nums) {
  let gap = 1;
  while (gap < nums.length / 3) {
    gap = gap * 3 + 1;
  }
  for (gap; gap > 0; gap = Math.floor(gap / 3)) {
    for (let i = gap; i < nums.length; i++) {
      let preIndex = i - gap;
      const currentVal = nums[i];
      for (
        preIndex;
        preIndex >= 0 && nums[preIndex] > currentVal;
        preIndex -= gap
      ) {
        nums[preIndex + gap] = nums[preIndex];
      }
      nums[preIndex + gap] = currentVal;
    }
  }
  return nums;
}

// 0 1 2
// [3, 1, 4, 2]

// [1, 3, 2, 4]
// [1, 2, 3, 4]
// [1, 2, 3, 4]

// let a = { m: 1 };
// let b = a;
// a = { b : 2}
// console.log(a, b)
// let a = {n : 1};
// a.x = a = {n: 2};

// let a = {n : 1};
// let b = a;
// a.x = a = {n: 2};


// console.log(a.x)
// console.log(b.x)


// console.log(a.x)
// console.log(b.x)

// function sort(nums) {

//   function partition (arr, l, r) {
//     const pivot = arr[l];
//     while(l < r) {
//       while(l < r && arr[r] > pivot) {
//         r--
//       }
//       arr[l] = arr[r];
//       while(l < r && arr[l] <= pivot) {
//         l++
//       }
//       arr[r] = arr[l]
//     }
//     arr[l] = pivot
//     return l
//   }

//   function recursive(arr, l, r) {
//     if(l < r) {
//       const pivotIndex = partition(arr, l, r);
//       recursive(arr, l, pivotIndex - 1);
//       recursive(arr, pivotIndex + 1, r)
//     }
//   }
//   recursive(nums, 0, nums.length - 1);
//   return nums
// }

// console.log(sort([2, 1]));
// console.log(sort([5, 1, 1, 2, 0, 0]), count1);
// console.log(sort([5, 1, 1, 2, 0, 0]));
// console.log([5, 1, 1, 2, 0, 0][6])
// console.log(sort(arr));

// console.log(Array.prototype)
// console.log(Function.prototype)
// console.log(Object.prototype)

let b = 'b';

// (function b() {
//   var b = '123'
//   console.log(b)
// })()

function _instanceOf(obj, fn) {
  while(obj) {
    if(obj.__proto__ === fn.prototype) return true
    obj = obj.__proto__
  }
  return false
}

var obj = {
  "2" : 3,
  "3" : 4,
  "length" : 2,
  "splice" : Array.prototype.splice,
  "push" : Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)

// b()


function permute(nums) {
  function swap(arr, l, r) {
    let temp = arr[r];
    arr[r] = arr[l];
    arr[l] = temp;
  }

  function recursive(arr, l, r, res) {
    if (l === r) {
      return res.push(arr.slice());
    }
    for (let i = l; i < r; i++) {
      swap(arr, l, i);
      recursive(arr, l + 1, r, res);
      swap(arr, l, i);
    }
  }
  let result = [];
  recursive(nums, 0, nums.length, result);
  return result;
}

function permute(nums) {
  let res = [];
  perm(nums, 0, nums.length - 1, res);
  return res;
}

function swap(arr, l, r) {
  let temp = arr[r];
  arr[r] = arr[l];
  arr[l] = temp;
}

// p 全排列的开始位置 q 全排列的结束位置
function perm(arr, p, q, res) {
  if (p === q) {
    console.log("当前已全部排列完", arr);
    res.push([...arr]);
  } else {
    for (let i = p; i <= q; i++) {
      console.log(
        `这是要对 ${arr[p]}(下标 ${p}) - ${arr[q]}(下标 ${q}) 进行全排列, 当前 arr ${arr}`
      );
      swap(arr, i, p);
      console.log(
        `交换了 ${arr[i]}(下标 ${i}) 和 ${arr[p]}(下标 ${p}) 的位置, 当前 arr ${arr}`
      );
      perm(arr, p + 1, q, res);
      console.log(
        `再次交换 ${arr[i]}(下标 ${i}) 和 ${arr[p]}(下标 ${p}) 的位置, 当前 arr ${arr}`
      );
      // 这里再次交换是为了保证 arr 的相对一致
      swap(arr, i, p);
    }
  }
}
// console.log(permute([1, 2, 3]))

// function permute(nums) {
//     function swap (nums, l, r) {
//         let memo = nums[r];
//         nums[r] = nums[l];
//         nums[l] = memo
//     }

//     function recursive(nums, l, r, res) {
//         if(l === r) {
//             res.push(nums.slice());
//         }
//         for(let i = l; i <= r; i++) {
//             swap(nums, l, i);
//             recursive(nums, l + 1, r, res)
//             swap(nums, l, i);
//         }
//     }

//     let result = [];
//     recursive(nums, 0, nums.length - 1, result);
//     return result
// }

// function permute(nums) {
//   const swap = (arr, l, r) => {
//     let memo = arr[r];
//     arr[r] = arr[l];
//     arr[l] = memo;
//   };
//   const recursive = (arr, l, r, res) => {
//     if (l === r) {
//       return res.push(arr.slice());
//     }
//     for (let i = l; i < r; i++) {
//       swap(arr, l, i);
//       recursive(arr, l + 1, r, res);
//       swap(arr, l, i);
//     }
//   };
//   let result = [];
//   recursive(nums, 0, nums.length, result);
//   return result;
// }

// function permute(nums) {
//   const swap = (arr, l, r) => {
//     const temp = arr[r];
//     arr[r] = arr[l];
//     arr[l] = temp;
//   };
//   let recursive = (arr, l, r, res) => {
//     if (l === r) {
//       return res.push(arr.slice());
//     }
//     for (let i = l; i < r; i++) {
//       swap(nums, l, i);
//       recursive(arr, l + 1, r, res);
//       swap(nums, l, i);
//     }
//   };
//   let result = [];
//   recursive(nums, 0, nums.length, result);
//   return result;
// }

// function permute(nums) {
//   function swap(arr, l, r) {
//     let temp = arr[r];
//     arr[r] = arr[l];
//     arr[l] = temp;
//   }
//   const recursive = (arr, l, r, res) => {
//     if (l === r) {
//       return res.push(arr.slice());
//     }
//     for (let i = l; i < r; i++) {
//       swap(arr, l, i);
//       recursive(arr, l + 1, r, res);
//       swap(arr, l, i);
//     }
//   };
//   let result = [];
//   recursive(nums, 0, nums.length, result);
//   return result;
// }

// console.log(permute([1, 2, 3]))

// var moveZeroes = function (nums) {
//   let index = 0;
//   for (let i = 0; i < nums.length; i++) {
//     if (nums[i] !== 0) {
//       nums[index++] = nums[i];
//     }
//   }
//   for (let i = index; i < nums.length; i++) {
//     nums[i] = 0;
//   }
//   return nums;
// };

function moveZeroes(nums) {
  let index = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[index++] = nums[i];
    }
  }
  for (let i = index; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
}

let arr1 = [0, 1, 0, 3, 12];
let arr2 = [0, 1, 0];
// console.log(moveZeroes(arr1));
// console.log(moveZeroes(arr2));

function maxProduct(nums) {
  let max = 0,
    imax = 1;
  imin = 1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) {
      const memo = imax;
      imax = imin;
      imin = memo;
    }
    imax = Math.max(nums[i], imax * nums[i]);
    imin = Math.min(nums[i], imin * nums[i]);
    max = Math.max(max, imax);
    // console.log(max, imax, imin, '[current]: ', nums[i]);
  }
  return max;
}

function maxProduct(nums) {
  let max = nums[0];
  let maxMemo = [max];
  let minMemo = [max];

  for (let i = 1; i < nums.length; i++) {
    maxMemo[i] = Math.max(
      nums[i],
      nums[i] * maxMemo[i - 1],
      nums[i] * minMemo[i - 1]
    );
    minMemo[i] = Math.min(
      nums[i],
      nums[i] * maxMemo[i - 1],
      nums[i] * minMemo[i - 1]
    );
    max = Math.max(max, maxMemo[i]);
  }
  return max;
}

// console.log(maxProduct([2,3,-2,4]), 'result')
// console.log(maxProduct([-2,0,-1]), 'result')
// console.log(maxProduct([0, 2]), "result");
// console.log(maxProduct([-2]), 'result')
// console.log(maxProduct([-1, -1]), 'result')
// console.log(maxProduct([-2,3,-4]), 'result')
