function combindeReducers(reducers) {
  return (state = {}, action) =>  {
    const currentState = {};
    for (let key in reducers) {
      currentState[key] = reducers[key](state[key], action);
    }
    return currentState;
  }
}