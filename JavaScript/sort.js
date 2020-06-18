let list = [3, 5, 15, 38, 36, 26, 27, 2, 4, 44, 46, 47, 48, 50];

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

