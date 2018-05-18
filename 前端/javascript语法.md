1. switch:  多个if...else连在一起使用的时候，可以转为使用更方便的switch结构。
需要注意的是，switch语句后面的表达式与case语句后面的表示式，在比较运行结果时，
采用的是严格相等运算符（===），而不是相等运算符（==），这意味着比较时不会发生类型转换。
```javascript
switch (fruit) {
  case "banana":
    // ...
    break;
  case "apple":
    // ...
    break;
  default:
    // ...
}
```
2. JavaScript 的数据类型，共有六种。
数值（number）：整数和小数（比如1和3.14）
字符串（string）：字符组成的文本（比如”Hello World”）
布尔值（boolean）：true（真）和false（假）两个特定值
undefined：表示“未定义”或不存在，即由于目前没有定义，所以此处暂时没有任何值
null：表示无值，即此处的值就是“无”的状态。
对象（object）：各种值组成的集合
数值、字符串、布尔值称为原始类型（primitive type）的值，即它们是最基本的数据类型，对象称为合成类型（complex type）的值,undefined和null，一般将它们看成两个特殊值

typeof运算符可以返回一个值的数据类型，可能有以下结果。
（1）原始类型: 数值、字符串、布尔值分别返回number、string、boolean。
```JavaScript
typeof 123 // "number"
typeof '123' // "string"
typeof false // "boolean"
```
(2) 函数: 函数返回function。
(3) undefined: undefined返回undefined。
```JavaScript
// 错误的写法
if (v) {
  // ...
}
// ReferenceError: v is not defined
// 正确的写法
if (typeof v === "undefined") {
  // ...
}
```
(4)其他除此以外，其他情况都返回object。
```JavaScript
typeof window // "object"
typeof {} // "object"
typeof [] // "object"
typeof null // "object"
```
既然typeof对数组（array）和对象（object）的显示结果都是object，那么怎么区分它们呢？instanceof运算符可以做到。
```JavaScript
var o = {};
var a = [];
o instanceof Array // false
a instanceof Array // true
```

3. null和undefined
null与undefined都可以表示“没有”，含义非常相似。将一个变量赋值为undefined或null，老实说，语法效果几乎没区别。
```JavaScript
if (!undefined) {
  console.log('undefined is false');
}
// undefined is false
if (!null) {
  console.log('null is false');
}
// null is false
undefined == null
// true
```

null表示空值，即该处的值现在为空。调用函数时，某个参数未设置任何值，这时就可以传入null。比如，某个函数接受引擎抛出的错误作为参数，如果运行过程中未出错，那么这个参数就会传入null，表示未发生错误。
undefined表示“未定义”，下面是返回undefined的典型场景。
```JavaScript
// 变量声明了，但没有赋值
var i;
i // undefined

// 调用函数时，应该提供的参数没有提供，该参数等于undefined
function f(x) {
  return x;
}
f() // undefined

// 对象没有赋值的属性
var  o = new Object();
o.p // undefined

// 函数没有返回值时，默认返回undefined
function f() {}
f() // undefined
```

4. ==和===。
简单说，它们的区别是相等运算符（==）比较两个值是否相等，严格相等运算符（===）比较它们是否为“同一个值”。如果两个值不是同一类型，严格相等运算符（===）直接返回false，而相等运算符（==）会将它们转化成同一个类型，再用严格相等运算符进行比较。
```javascript
1 === "1" // false
true === "true" // false
```



5. JSON 字符串转换为 JavaScript 对象
使用 JavaScript 内置函数 JSON.parse() 将字符串转换为 JavaScript 对象:
``` javascript
//简单用法
var obj = JSON.parse(jsonText);

//使用可选参数，回调函数
JSON.parse('{"p": 5}', function(k, v) {
  if (k === '') { return v; } 
  return v * 2;               
});                          
JSON.parse('{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}', function(k, v) {
  console.log(k); // 输出当前属性，最后一个为 ""
  return v;       // 返回修改的值
});


JSON.stringify(value[, replacer[, space]])
value: 必需， 要转换的 JavaScript 值（通常为对象或数组）。

replacer: 可选。用于转换结果的函数或数组。
如果 replacer 为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：""。

如果 replacer 是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。当 value 参数也为数组时，将忽略 replacer 数组。

space:
可选，文本添加缩进、空格和换行符，如果 space 是一个数字，则返回值文本在每个级别缩进指定数目的空格，如果 space 大于 10，则文本缩进 10 个空格。space 有可以使用非数字，如：\t。
```