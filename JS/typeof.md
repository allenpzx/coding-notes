**`typeof` 特性**

```javascript
typeof {} => 'object'
typeof [] => 'object'
typeof null => 'object'
typeof new RegExp() => 'object'
typeof new Date() => 'object'
typeof new String('test') => 'object'
typeof new Number(100) => 'object'

typeof 0 => 'number'
typeof Infinity => 'number';
typeof NaN => 'number';

typeof () => {} => 'function'
typeof class TEST {} => 'function'
typeof new Functiuon() => 'function'

typeof true => 'boolean'

typeof undefined => 'undefined'
typeof document.all => 'undefined'
typeof undeclaredVariable => 'undefined'

typeof 'test' => 'string'

typeof Symbol() => 'symbol'
```