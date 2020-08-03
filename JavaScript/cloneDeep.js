function cloneDeep(obj, memo = new WeakMap()) {
  const needRecursive = (tar) =>
    tar != null && (typeof tar === "object" || typeof tar === "function");

  if (needRecursive(obj)) {
    if (memo.get(obj)) {
      return memo.get(obj);
    }
    let result = Array.isArray(obj) ? [] : {};
    memo.set(obj, result);
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        const value = obj[i];
        result[i] = needRecursive(value) ? cloneDeep(value, memo) : value;
      }
    }
    return result;
  }

  return obj;
}

// function copyDeeply(obj, memo = new WeakMap()) {
//   if (memo.has(obj)) return memo.get(obj);
//   const isRefrenceType = (tar) => tar && typeof tar === "object";
//   if (isRefrenceType(obj)) {
//     let result = new obj.constructor();
//     if (obj.constructor === RegExp) {
//       return new RegExp(obj);
//     }
//     for (let i in obj) {
//       if (obj.hasOwnProperty(i)) {
//         const val = obj[i];
//         result[i] = isRefrenceType(val) ? copyDeeply(val) : val;
//       }
//     }
//     memo.set(obj, result);
//     return result;
//   }
//   return obj;
// }

const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
  field5: null,
  field6: new RegExp(),
};
target.target = target;

console.time("cloneDeep");
const target2 = cloneDeep(target);
console.timeEnd("cloneDeep");
target2.field4[0] = "abc";
console.log(target, target2);
