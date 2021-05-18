function bindActionCreators(actions, dispatch) {
  return Object.keys(actions).map(key => {
    return {
      [key]: (...params) => {
        dispatch(actions[key].apply(null, params));
      }
    }
  })
}