// console.log(Math.random())
// console.log(Math.ceil(Math.random())) // to up
// console.log(Math.floor(Math.random())) // to down
// console.log(Math.round(Math.random())) // up or down

// [n, m]
function getRandom(left, right) {
    return Math.round((Math.random() * (right - left)) + left)
}

// (n , m)
function getRandom2(left, right) {
    left +=1;
    right -=1;
    return Math.round((Math.random() * (right - left)) + left)
}

// [n , m)
function getRandom3(left, right) {
    return Math.floor((Math.random() * (right - left)) + left)
}

// (n , m]
function getRandom4(left, right) {  
    return Math.ceil((Math.random() * (right - left)) + left)
}

