const list = [5, 1, 2, 4, 3, 0, 1, 2, 3, 0, 5, 1];

function removeDuplicate(arr) {
  let result = [];
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      obj[arr[i]] = 1;
      result.push(arr[i]);
    }
  }
  return result;
}

console.time("removeDuplicate");
console.log(removeDuplicate(list.slice()), list);
console.timeEnd("removeDuplicate");

function removeDuplicate2(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }
  return result;
}

console.time("removeDuplicate2");
console.log(removeDuplicate2(list.slice()), list);
console.timeEnd("removeDuplicate2");
