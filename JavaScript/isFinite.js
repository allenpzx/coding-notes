Number.isFinite('0') === isFinite('0') // false

Number.isFinite(0) === isFinite('0') // true

// Number.isFinite()检测有穷性的值，唯一和全局isFinite()函数相比，这个方法不会强制将一个非数值的参数转换成数值，这就意味着，只有数值类型的值，且是有穷的（finite），才返回 true