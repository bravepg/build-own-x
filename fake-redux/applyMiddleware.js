const compose = require('./compose');

function applyMiddleware(...middlewares) {
  return function a1(createStore) {
    return function a2(reducer) {
      const store = createStore(reducer);
      let dispatch = store.dispatch;
      let chain = [];

      const middlewareAPI = {
        getState: store.getState,
        dispatch,
      }
      
      chain = middlewares.map((middleware) => middleware(middlewareAPI));
      dispatch = compose(...chain)(dispatch);

      return {
        ...store,
        dispatch,
      }
    }
  }
}

module.exports = applyMiddleware;
