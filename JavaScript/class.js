/**
 * @description
 * 在constructor中var一个变量，它只存在于constructor这个构造函数中在constructor中
 * 使用this定义的属性和方法会被定义到实例上 (会定义到实例对象上)
 * 在class中使用=来定义一个属性和方法，效果与第二点相同，会被定义到实例上 (会定义到实例对象上)
 * 在class中直接定义一个方法，会被添加到原型对象prototype上
 * constructor中定义的相同名称的属性和方法会覆盖在class里定义的
 */

class Test {
    constructor (name, age) {
        var a = 'a'
        this.name = name;
        this.age = age
    }

    b = 'b';

    static stacticC = 123;

    getName = function () {
        console.log(this.name)
    }

    getAge () {
        console.log(this.age)
    }
}

Test.description = 'This is Test description!';

let test = new Test('testName', 17);

console.log(test)
console.log(Object.keys(test))
console.log(Object.getOwnPropertyNames(test))
console.log(Object.getPrototypeOf(test)) // node different with browser
for(let i in test) {
    console.log('loop: ', i, test.hasOwnProperty(i));
}
console.log(test.description, '|' ,Test.description)
console.log(test.stacticC, '|' ,Test.stacticC)
console.log(test.a)
test.getName();
test.getAge();

console.log('                                               ')


function Person(name, age) {
    var pri = 'pri';
    this.name = name;
    this.age = age;
    this.getName = function () {
        console.log(this.name)
    }
}

Person.prototype.getAge = function () {
    console.log(this.age)
}

Person.description = 'This is Person description!'

let person = new Person('person', '17');

console.log(person)
console.log(Object.keys(person))
console.log(Object.getOwnPropertyNames(person))
console.log(Object.getPrototypeOf(person))
for(let i in person) {
    console.log('loop: ', i, person.hasOwnProperty(i));
}
console.log(person.description, '|' ,person.description)
console.log(person.pri)
person.getName();
person.getAge();