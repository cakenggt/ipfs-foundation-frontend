var defaultState = {
	modal: null
};

export default function (state = defaultState, action) {
	switch (action.type) {
		case 'REMOVE_MODAL':
			return Object.assign({}, state, {
				modal: null
			});
		case 'ADD_MODAL':
			return Object.assign({}, state, {
				modal: action.data
			});
		default:
			return state;
	}
}
