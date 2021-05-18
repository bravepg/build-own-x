// https://github.com/JOE-XIE/MyWheel/tree/master/MyRedux
// redux 的基础用法
// 创建一个 reducer
// function reducer(state, action) {}
// // 生成 store
// const store = createStore(reducer);
// // 注册回调函数
// store.subscribe(() => {})
// // 触发 action

const applyMiddleware = require('./applyMiddleware');

function createStore(reducer, enhancer) {
  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer);
  }
  let state = null;
  const listeners = [];

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((cb) => cb());
  }

  dispatch({})

  return {
    getState,
    dispatch,
    subscribe,
  }
}

function reducer(state, action) {
  if (!state) {
    state = { count: 0 };
  }
  switch(action.type) {
    case 'add':
      return { ...state, count: ++state.count };
    default:
      return state;
  }
}

function logger1({ dispatch, getState }) {
  return function l11(next) {
    return function l12(action) {
      console.log('1', getState());
      next(action);
      console.log('1', getState());
    }
  }
}

function logger2({ dispatch, state }) {
  return function l21(next) {
    return function l22(action) {
      console.log('2', store.getState());
      next(action);
      console.log('2', store.getState());
    }
  }
}

const store = createStore(reducer, applyMiddleware(logger1, logger2));

store.dispatch({
  type: 'add',
});