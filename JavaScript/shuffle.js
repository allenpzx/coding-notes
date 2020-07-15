/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
    this.origin = nums;
};

/**
 * Resets the array to its original configuration and return it.
 * @return {number[]}
 */
Solution.prototype.reset = function() {
    return this.origin
};

/**
 * Returns a random shuffling of the array.
 * @return {number[]}
 */
Solution.prototype.shuffle = function() {
    let arr = this.origin.slice();
    function getRoundIndex (l, r) {
        return Math.round(Math.random() * l) + (r - l)
    }
    function swap (arr, l, r) {
        let temp = arr[r];
        arr[r] = arr[l];
        arr[l] = temp;
    }
    for(let i = 0; i < arr.length; i++)  {
        const rand = getRoundIndex(i, arr.length - 1);
        swap(arr, i, rand);
    }
    return arr
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.reset()
 * var param_2 = obj.shuffle()
 */

let foo = new Solution([2, 1, 3])
const res = foo.shuffle();
console.log(res);