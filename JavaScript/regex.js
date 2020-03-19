let b = 'abc def';

let between = /(?<=a).*(?=f)/
let matchBetween = b.match(between);
// console.log(matchBetween)

let before = /\w+(?=\s)/
let matchBefore = b.match(before);
// console.log(matchBefore)

let after = /(?<=\s)\w+/
let matchAfter = b.match(after);
// console.log(matchAfter)


const name = 'first_name';
const price = 9999999;
const price2 = 1234567;

function toCamelCase(str) {
    return str.replace(/(?:\_)\w{2}/, function (res, i) {
        return res[1].toUpperCase();
    })
}
// console.log(toCamelCase(name))

let regex = /(?<=\_)[a-z]+/
let regex2 = /[a-z]+(?=\_)/

// console.log(name.match(regex))
// console.log(name.match(regex2))

// console.log(name.indexOf('_', 5))

function thousands (num) {
    let regex = /\d{1,3}(?=(\d{3})+$)/g;
    let str = `${num}`;
    return str.replace(regex, '$&,')
}

// console.log(thousands(price))
// console.log(thousands(price2))