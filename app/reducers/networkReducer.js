var defaultState = {
	status: 'PENDING'
};

export default function(state = defaultState, action){
  switch (action.type){
    case 'UPDATE_NETWORK_STATUS':
      return Object.assign({}, state, {
        status: action.data
      });
    default:
      return state;
  }
}
