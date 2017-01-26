var defaultState = {
  files: [],
  file: null
}

export default function(state = defaultState, action){
  switch (action.type){
    case 'LOAD_FILES':
      return Object.assign({}, state, {
        files: action.data
      });
    case 'LOAD_FILE':
      return Object.assign({}, state, {
        file: action.data
      });
    default:
      return state;
  }
}
