/**
 * @param {*} fn 异步函数
 */
 function MyPromise(fn) {
  this.onFulFilled = null; // 执行成功的回调函数
  this.onRejected = null; // 执行失败的回调函数

  // 执行异步函数
  fn((value) => {
    setTimeout(() => {
      this.onFulFilled(value);
    });
  }, (value) => {
    setTimeout(() => {
      this.onRejected(value);
    });
  });
}

// then 后面的函数肯定是要执行的，那么什么时候执行呢？
// 在异步函数执行之后，所以要定义变量（onFulFilled、onReject）来接收参数
MyPromise.prototype.then = function(resolve, reject) {
  console.log('then 执行');
  this.onFulFilled = resolve;
  this.onRejected = reject;
}

module.exports = MyPromise;
