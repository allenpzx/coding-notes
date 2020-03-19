/**
 * 
 * @description
 * void: 没有返回值，null | undefined
 * never: 用不存在的值类型，函数的话程序永远不会触达到底，返回值类型的函数无法正常返回，无法终止，或会抛出异常。
 * unknown: 被确定是某个类型前, 它不能被进行任何操作, 如: 实例化、getter、函数执行等.
 */


function test1(name: string):void {
    this.name = name
}

function test2():never {
    throw Error()
}

function test3():never {
    while(true) {

    }
}

let ab: any;
let cd: unknown;
let _ab: number;
let _cd: object;
ab = 1
cd = {}

ab.c.c = 1; // ok
// cd.c = 2  error 
// _cd = cd error