let list = [3, 5, 15, 38, 36, 26, 27, 2, 4, 44, 46, 47, 48, 50];
const arr = [1, 20, 10, 30, 22, 11, 55, 24, 31, 88, 12, 100, 50];

function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let n = 0; n < arr.length - 1 - i; n++) {
      if (arr[n] > arr[n + 1]) {
        let tem = arr[n];
        arr[n] = arr[n + 1];
        arr[n + 1] = tem;
      }
    }
  }
  return arr;
}

console.time("bubbleSort");
const bubbleSortResult = bubbleSort(list.slice());
console.log("result: ", bubbleSortResult);
console.timeEnd("bubbleSort");
console.log("                                             ");

function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let index = i;
    for (let n = i + 1; n < arr.length; n++) {
      if (arr[n] < arr[index]) {
        index = n;
      }
    }
    let temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }
  return arr;
}

console.time("selectionSort");
const selectionSortResult = selectionSort(list.slice());
console.log("result: ", selectionSortResult);
console.timeEnd("selectionSort");
console.log("                                             ");

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let preIndex = i - 1;
    let current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}

console.time("insertionSort");
const insertionSortResult = insertionSort(list.slice());
console.log("result: ", insertionSortResult);
console.timeEnd("insertionSort");
console.log("                                             ");

function quickSort(nums) {
  const partition = (arr, l, r) => {
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
  };
  const recursive = (arr, l, r) => {
    if (l < r) {
      const pivot = partition(arr, l, r);
      recursive(arr, l, pivot - 1);
      recursive(arr, pivot + 1, r);
    }
  };
  recursive(nums, 0, nums.length - 1);
  return nums;
}

console.time("quickSort");
const quickSortResult = quickSort(list.slice());
console.log("result: ", quickSortResult);
console.timeEnd("quickSort");
console.log("                                             ");

function shellSort(nums) {
  let gap = 1;
  while (gap < nums.length / 3) {
    gap = gap * 3 + 1;
  }
  for (gap; gap > 0; gap = Math.floor(gap / 3)) {
    for (let i = gap; i < nums.length; i++) {
      let index = i - gap;
      const current = nums[i];
      for (index; index >= 0 && nums[index] > current; index -= gap) {
        nums[index + gap] = nums[index];
      }
      nums[index + gap] = current;
    }
  }
  return nums;
}

console.time("shellSort");
const shellSortResult = shellSort(list.slice());
console.log("result: ", shellSortResult);
console.timeEnd("shellSort");
console.log("                                             ");

// function heapSort(arr) {
//   function swap(arr, l, r) {
//     const temp = arr[r];
//     arr[r] = arr[l];
//     arr[l] = temp;
//   }
//   function heaplify(arr, n, i) {
//     let c1 = i * 2 + 1;       // left child node
//     let c2 = i * 2 + 2;       // right child node
//     let max = i;
//     if (i >= n) return;
//     if (c1 < n && arr[c1] > arr[max]) {
//       max = c1;
//     }
//     if (c2 < n && arr[c2] > arr[max]) {
//       max = c2;
//     }
//     if (max !== i) {
//       swap(arr, max, i);      // make the max index on top
//       heaplify(arr, n, max);  // deeply search in max index
//     }
//   }
//   function build_heap(tree) {
//     const lastNode = tree.length - 1;
//     const lastNodeParent = Math.floor((lastNode - 1) / 2);
//     for (let i = lastNodeParent; i >= 0; i--) {
//       heaplify(tree, tree.length, i);
//     }
//   }
//   function sort_heap(tree) {
//     build_heap(tree);
//     for (let i = tree.length - 1; i >= 0; i--) {
//       swap(tree, 0, i);
//       heaplify(tree, i, 0);
//     }
//   }
//   sort_heap(arr);
//   return arr;
// }

function heapSort(arr) {
  function swap(arr, l, r) {
    const temp = arr[r];
    arr[r] = arr[l];
    arr[l] = temp;
  }

  function heaplify(arr, range, parent) {
    const c1 = parent * 2 + 1; // left child node
    const c2 = parent * 2 + 2; // right child node
    let max = parent;
    if (parent >= range) return;
    if (c1 < range && arr[c1] > arr[max]) {
      max = c1;
    }
    if (c2 < range && arr[c2] > arr[max]) {
      max = c2;
    }
    if (max !== parent) {
      swap(arr, max, parent); // make the max index on top
      heaplify(arr, range, max); // deeply search max index node after change the max
    }
  }

  function buildHeap(tree) {
    const lastNodeParent = Math.floor((tree.length - 1) / 2);
    for (let i = lastNodeParent; i >= 0; i--) {
      heaplify(tree, tree.length, i);
    }
  }

  function sortHeap(tree) {
    buildHeap(tree);
    for (let i = tree.length - 1; i >= 0; i--) {
      swap(tree, 0, i);
      heaplify(tree, i, 0);
    }
  }

  sortHeap(arr);
  return arr;
}

console.time("heapSort");
const heapSortResult = heapSort(list.slice());
console.log("result: ", heapSortResult);
console.timeEnd("heapSort");
console.log("                                             ");

function mergeSort(arr) {
  function merge(arr, start, middle, end) {
    // let left = arr.slice(start, middle);
    // let right = arr.slice(middle, end + 1);
    let left = [];
    let right = [];
    for (let i = start; i < middle; i++) {
      left[i - start] = arr[i];
    }
    for (let i = middle; i <= end; i++) {
      right[i - middle] = arr[i];
    }
    let l = 0;
    let r = 0;
    let i = start;
    while (l < left.length && r < right.length) {
      if (left[l] < right[r]) {
        arr[i] = left[l];
        l++;
        i++;
      } else {
        arr[i] = right[r];
        r++;
        i++;
      }
    }
    while (l < left.length) {
      arr[i] = left[l];
      l++;
      i++;
    }

    while (r < right.length) {
      arr[i] = right[r];
      r++;
      i++;
    }
  }
  function divide(arr, l, r) {
    if (l === r) return;
    const m = Math.floor((l + r) / 2);
    divide(arr, l, m);
    divide(arr, m + 1, r);
    merge(arr, l, m + 1, r);
  }
  divide(arr, 0, arr.length - 1);
  return arr;
}

console.time("mergeSort");
const mergeSortResult = mergeSort(list.slice());
console.log("result: ", mergeSortResult);
console.timeEnd("mergeSort");
console.log("                                             ");
