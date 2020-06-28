function majorityElement (nums) {
    let half = nums.length / 2;
    let obj = {};
    for(let num of nums) {
        obj[num] = (obj[num] || 0) + 1
        if(obj[num] > half) return num
    }
}

console.time('majorityElement')
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2]));
console.log(majorityElement([3, 3, 4]));
console.timeEnd('majorityElement');