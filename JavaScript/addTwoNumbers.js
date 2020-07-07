// /**
//  * Definition for singly-linked list.
//  * function ListNode(val) {
//  *     this.val = val;
//  *     this.next = null;
//  * }
//  */
// /**
//  * @param {ListNode} l1
//  * @param {ListNode} l2
//  * @return {ListNode}
//  */
// var addTwoNumbers = function (l1, l2) {
//   const memo_l1 = [];
//   let next_l1 = true;
//   while (next_l1) {
//     memo_l1.unshift(l1.val);
//     if (l1.next) {
//       l1 = l1.next;
//     } else {
//       next_l1 = false;
//     }
//   }

//   const memo_l2 = [];
//   let next_l2 = true;
//   while (next_l2) {
//     memo_l2.unshift(l2.val);
//     if (l2.next) {
//       l2 = l2.next;
//     } else {
//       next_l2 = false;
//     }
//   }

//   console.log(memo_l1)
//   const count = (parseInt(memo_l1.join('')) + parseInt(memo_l2.join('')) + '').split(''); 
//   let result = null;
//   for(let i = 0; i < count.length; i++) {
//     let obj = {
//         val: parseInt(count[i]),
//         next: i === 0 ? null : result
//     }
//     result = obj
//   }
//   return result
// };

// console.time("addTwnNumbers");
// const res = addTwoNumbers(
//   {
//     val: 2,
//     next: { val: 4, next: { val: 3, next: null } },
//   },
//   {
//     val: 5,
//     next: {
//       val: 6,
//       next: { val: 4, next: null },
//     },
//   }
// );
// console.log(res);
// console.timeEnd("addTwnNumbers");
