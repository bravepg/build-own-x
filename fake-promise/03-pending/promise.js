const PENDING = 'pending';
const FULFILLED = 'fulFilled';
const REJECTED = 'rejected';

/**
 * @param {*} fn 异步函数
 */
function MyPromise(fn) {
  this.status = PENDING;
  this.value = null; // 执行成功的结果
  this.error = null; // 执行失败的结果
  this.onFulFilled = null; // 执行成功的回调函数
  this.onRejected = null; // 执行失败的回调函数

  // 执行异步函数
  fn((value) => {
    // 如果状态是 pending 才修改状态
    if (this.status === PENDING) {
      setTimeout(() => {
        this.value = value;
        this.status = FULFILLED;
        this.onFulFilled(value);
      });
    }
  }, (error) => {
    if (this.status === PENDING) {
      setTimeout(() => {
        this.error = error;
        this.status = REJECTED;
        this.onRejected(error);
      });
    }
  });
}

// then 后面的函数肯定是要执行的，那么什么时候执行呢？
// 在异步函数执行之后，所以要定义变量（onFulFilled、onReject）来接收参数
MyPromise.prototype.then = function(onFulFilled, onRejected) {
  console.log('then 执行');
  if (this.status === PENDING) {
    this.onFulFilled = onFulFilled;
    this.onRejected = onRejected;
  } else if (this.status === FULFILLED) {
    onFulFilled(this.value);
  } else {
    onFulFilled(this.error);
  }
}

module.exports = MyPromise;
