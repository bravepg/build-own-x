const MyPromise = require('./promise');
// const promise2 = new MyPromise(((resolve, reject) => {
//   console.log('回调2函数执行');
//   setTimeout(() => {
//     console.log('异步2函数执行');
//     resolve(2);
//   }, 1000);
// }));
// 因为 resolve reject 可以作为参数，因此 MyPromise 内部必须要有 resolve reject 的定义
new MyPromise((resolve, reject) => {
  // console.log('回调函数执行');
  // setTimeout(() => {
  //   console.log('异步函数执行');
    reject(1);
  // }, 1000);
}).then((value) => {
  console.log(value + 1);
  // return promise2;

}, (value) => {
  throw value + 1;
}).catch((value) => {
  console.log('xx', value + 2);
});

// setTimeout(() => {
//   promise2.then(x => console.log('x', x));
//   console.log('在 then 前面执行');
// }, 3000);
