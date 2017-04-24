import {
	searchFileNameAndDescription,
	searchFileNameAndDescriptionAndCategory,
	loadFile,
	addFile,
	addComment
} from '../manager/file-manager';
import {ipnsURL} from '../settings';

export function initData() {
	return function (dispatch) {
		if (!window.location.pathname.startsWith(ipnsURL)) {
			fetch(ipnsURL, {
				method: 'HEAD'
			})
			.then(function (response) {
				if (response.ok) {
					dispatch({
						type: 'ADD_MODAL',
						data: 'REDIRECT'
					});
				} else {
					console.log('Failed to get response from ipns, won\'t ask for upgrade');
				}
			});
		}
	};
}

export function postFile(file, router) {
	return function () {
		router.replace('/');
		addFile(file);
	};
}

export function postComment(comment) {
	return function (dispatch) {
		addComment(comment);
		dispatch({
			type: 'ADD_COMMENT',
			data: comment
		});
	};
}

export function searchFiles(string, category) {
	return function (dispatch) {
		var results;
		if (category) {
			results = searchFileNameAndDescriptionAndCategory(string, category);
		} else {
			results = searchFileNameAndDescription(string);
		}
		dispatch({
			type: 'LOAD_FILES',
			data: results
		});
	};
}

export function loadFileById(id) {
	return function (dispatch) {
		dispatch({
			type: 'LOAD_FILE',
			data: loadFile(id)
		});
	};
}
