function func(a) {
  arguments[0] = 99; // 更新了arguments[0] 同样更新了a
  console.log(a);
}
func(10); // 99

function func(a) {
  a = 99; // 更新了a 同样更新了arguments[0]
  console.log(arguments[0]);
}
func(10); // 99



//   当非严格模式中的函数有包含剩余参数、默认参数和解构赋值，那么arguments对象中的值不会跟踪参数的值（反之亦然）。相反, arguments反映了调用时提供的参数：

function func(a = 55) {
  arguments[0] = 99; // updating arguments[0] does not also update a
  console.log(a);
}
func(10); // 10

function func(a = 55) {
  a = 99; // updating a does not also update arguments[0]
  console.log(arguments[0]);
}
func(10); // 10

function func(a = 55) {
  console.log(arguments[0]);
}
func(); // undefined
