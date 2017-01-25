var defaultState = {
  files: []
}

export default function(state = defaultState, action){
  switch (action.type){
    case 'LOAD_FILES':
      return Object.assign({}, state, {
        files: action.data
      });
    default:
      return state;
  }
}
