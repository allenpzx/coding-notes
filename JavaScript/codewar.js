// const a = getRandom(0, 10);
// console.log('[0, 10]: ',  a)
// const b = getRandom2(0, 10);
// console.log('(0, 10): ',  b)
// const c = getRandom3(0, 10);
// console.log('[0, 10): ', c)
// const d = getRandom4(0, 10);
// console.log('(0, 10]: ', d)

// function persistence(num) {
//     //code me
//     let count = 0;
//     if(num < 10) {
//       return 0
//     }
//     let _num = num;
//     while(true) {
//       let _arr = (_num + '').split('');
//       if(_arr.length === 1) {
//         break;
//       }
//       count++
//       const res = _arr.reduce((prev, curr) => parseInt(prev) * (curr));
//       _num = res
//     }
//     return count
//  }

//  console.log(persistence(4))

// function order(words){
//     // ...
//     return words.split(' ').sort((a, b) => a.match(/\d/) - b.match(/\d/)).join(' ')
//   }

// console.log(order("is2 Thi1s T4est 3a"))
// console.log(order("4of Fo1r pe6ople g3ood th5e the2"))
// console.log(order(""))

// function pigIt(str) {
//     return str.split(' ').reduce((prev, curr) => {
//         const all = curr.split('');
//         all.push(all.slice(0, 1)[0]);
//         all.shift();
//         return prev + `${all.join('')}${/\w/.test(curr) ? 'ay ': ''}`
//     }, '').trim()
// }

// console.log(pigIt('Pig latin is cool'))
// console.log(pigIt('This is my string'))
// console.log(pigIt("Acta est fa,bula"))
// console.log(pigIt('Hello world !'))

// function humanReadable(seconds) {
//   // TODO
//   const pad = (num) => num < 10 ? `0${num}` : num;
//   const HH = parseInt(seconds / 60 / 60);
//   const MM = parseInt(seconds / 60 % 60);
//   const SS = seconds % 60;
//   return `${pad(HH)}:${pad(MM)}:${pad(SS)}`;
// }
// console.log(humanReadable(0));
// console.log(humanReadable(5));
// console.log(humanReadable(60));
// console.log(humanReadable(86399));
// console.log(humanReadable(359999));

// function duplicateCount(text){
//     //...
//     let count = 0;
//     let dups = [];
//     text = text.toLowerCase();
//     for(let i = 0; i < text.length; i++) {
//         if(text.indexOf(text[i], i + 1) > -1 && dups.indexOf(text[i]) === -1) {
//             count+=1;
//             dups.push(text[i])
//         }
//     }
//     return count
//   }

//   console.log(duplicateCount(""))
//   console.log(duplicateCount("abcde"))
//   console.log(duplicateCount("aabbcde"))
//   console.log('aaab'.indexOf('a', 2))

// function tickets(peopleInLine){
//     // ...
//     let total = [];
//     let result = true;
//     let arr = peopleInLine.slice();
//     for(let i = 0; i < arr.length; i++) {
//         const curr = arr[i];
//         if(curr === 25) {
//             total.push(curr)
//             continue
//         }
//         const backIndex = () => total.findIndex(v=>v===25);
//         const backIndex2 = () => total.findIndex(v=>v===50);
//         if(curr === 50 && (backIndex()) === -1) {
//             result = false;
//             break
//         }
//         if(curr === 50 && (backIndex()) > -1) {
//             total.splice((backIndex()), 1);
//             total.push(50)
//             continue
//         }
//         if(curr === 100) {
// //         console.log('==', total, curr, peopleInLine)
//             if((backIndex()) > -1 && (backIndex2()) > -1) {
//                 total.splice(backIndex(), 1)
//                 total.splice(backIndex2(), 1)
//                 total.push(100)
//                 continue
//             }
//             if(total.filter(v => v===25).length > 2) {
//                 let count = 0;
//                 let _arr = []
//                 for(let i = 0; i < total.length; i++) {
//                     if(count > 2) {
//                         _arr.push(total[i])
//                         continue
//                     }
//                     if(total[i] === 25) {
//                         count+=1;
//                         continue
//                     }
//                     _arr.push(total[i])
//                 }
//                 total = _arr.concat(100)
//                 continue
//             }
//             result = false
//             break;
//         }
//     }
//     return result ? 'YES' : 'NO'
// }

// console.log(tickets([25, 25, 50, 50]))
// console.log(tickets([25, 100]))
// console.log(tickets([25, 25, 50, 50, 100]))
// console.log(tickets([25,25,50,100,25,25,25,100,25,50,25,100,25,50,25,100]))
// console.log(tickets([ 25, 25, 25, 25, 25, 100, 100 ]))
// console.log(tickets([ 25, 25, 25, 25, 50, 100, 50 ]))

// let obj = [
//   { a: 1 },
//   { b: [1, 2] },
//   {c: {
//     d: 1
//   }}
// ];

// let obj2 = copyDeep(obj);
// obj2[0].a = 2;
// obj2[1].b = '123'
// obj2[2].c.d = obj

// function copyDeep (target, store = new Map()) {
//     const needLoop = (tar) => Array.isArray(tar) || (tar && tar.constructor === Object)
//     if(needLoop(target)) {
//         let result = Array.isArray(target) ? [] : {};
//         for(let i in target) {
//             if(target.hasOwnProperty(i)) {
//                 const value = target[i];
//                 result[i] = needLoop(value) ? copyDeep(value) : value
//             }
//         }
//         return result;
//     }
//     return target
// }
// console.log(obj2, obj);

// let obj = [
//   {
//     name: "hh",
//     score: 100,
//     detail: {
//       age: 18,
//       gender: "femail"
//     }
//   },
//   {
//     name: "xx",
//     score: 99,
//     detail: {
//       age: 17,
//       gender: "mail"
//     }
//   }
// ];

// console.log(JSON.stringify(obj, ['name'], 4))
