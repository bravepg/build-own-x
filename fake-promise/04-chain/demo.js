const MyPromise = require('./promise');

// 因为 resolve reject 可以作为参数，因此 MyPromise 内部必须要有 resolve reject 的定义
new MyPromise((resolve, reject) => {
  console.log('回调函数执行');
  setTimeout(() => {
    console.log('异步函数执行');
    resolve(1);
  }, 1000);
}).then((value) => {
  console.log(value);
}).then((value) => {
  console.log(value + 1);
});
