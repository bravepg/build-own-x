/**
 * @param {*} fn 异步函数
 */
const PENDING = 'pending';
const FULFILLED = 'fulFilled';
const REJECTED = 'rejected';

function MyPromise(fn) {
  this.status = PENDING;
  this.value = null; // 成功的返回结果
  this.error = null; // 失败的返回结构
  this.onFulFilledCbs = []; // 执行成功的回调函数
  this.onRejectedCbs = []; // 执行失败的回调函数

  fn((value) => {
    if (this.status === PENDING) {
      setTimeout(() => {
        this.status = FULFILLED;
        this.value = value;
        this.onFulFilledCbs.forEach(cb => cb(value));
      });
    }
  }, (error) => {
    if (this.status === PENDING) {
      setTimeout(() => {
        this.status = REJECTED;
        this.error = error;
        this.onRejectedCbs.forEach(cb => cb(error));
      });
    }
  });
}

function resolvePromise(x, resolve, reject) {
  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      x.then((y) => {
        resolvePromise(y, resolve, reject);
      }, (err) => reject(err));
    } else {
      x.then(resolve, reject);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function(onFulFilled, onRejected) {
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
  onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
  if (this.status === PENDING) {
    return new MyPromise((resolve, reject) => {
      this.onFulFilledCbs.push((value) => {
        try {
          x = onFulFilled(value);
          resolvePromise(x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      this.onRejectedCbs.push((error) => {
        try {
          x = onRejected(error);
          resolvePromise(x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  if (this.status === FULFILLED) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onFulFilled(this.value);
          resolvePromise(x, resolve, reject)
        } catch (e) {
          reject(e);
        }
      });
    });
  } 
  if (this.status === REJECTED) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onRejected(this.error);
          resolvePromise(x, resolve, reject)
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  return this;
}

MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
}

MyPromise.all = function(promises) {
  return new MyPromise((resolve, reject) => {
    const result = [];
    let count = 0;
    for (let i = 0; i++; i < promises.length) {
      promises[i].then((value) => {
        result[i] = value;
        if (++count === promises.length) {
          resolve(result);
        }
      }, (error) => {
        reject(error);
      })
    }
  });
}

MyPromise.race = function(promises) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i++; i < promises.length) {
      promises[i].then((value) => {
        resolve(value);
      }, (error) => {
        reject(error);
      })
    }
  });
}

MyPromise.race = function(value) {
  return new MyPromise((resolve, reject) => {
    resolve(value);
  });
}

MyPromise.resolve = function(value) {
  return new MyPromise((resolve, reject) => {
    resolve(value);
  });
}

MyPromise.reject = function(error) {
  return new MyPromise((resolve, reject) => {
    reject(error);
  });
}

module.exports = MyPromise;
