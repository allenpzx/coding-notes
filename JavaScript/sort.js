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
      arr[l] = arr[r]
      while (l < r && arr[l] <= pivot) {
        l++;
      }
      arr[r] = arr[l]
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
  while(gap < nums.length / 3) {
    gap = gap * 3 + 1
  }
  for(gap; gap > 0; gap = Math.floor(gap / 3)) {
    for(let i = gap; i < nums.length; i++) {
      let index = i - gap;
      const current = nums[i];
      for(index; index >= 0 && nums[index] > current; index -= gap) {
        nums[index + gap] = nums[index];
      }
      nums[index + gap] = current
    }
  }
  return nums
}

console.time("shellSort");
const shellSortResult = shellSort(list.slice());
console.log("result: ", shellSortResult);
console.timeEnd("shellSort");
console.log("                                             ");
