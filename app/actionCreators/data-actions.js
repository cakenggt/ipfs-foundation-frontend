import {
	searchFileNameAndDescription,
	searchFileNameAndDescriptionAndCategory,
	loadFile,
	addFile,
	addComment
} from '../manager/file-manager';
import {connect} from '../dao/set-db-dao';
import {ipnsURL} from '../settings';

export function initData() {
	return function (dispatch) {
		connect
		.then(() => {
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
		})
		.catch(err => {
			console.log(`Error during connect: ${err}`);
			dispatch({
				type: 'ADD_MODAL',
				data: 'SETUP'
			});
		});
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
		var search;
		if (category) {
			search = searchFileNameAndDescriptionAndCategory(string, category);
		} else {
			search = searchFileNameAndDescription(string);
		}
		search
		.then(results => {
			dispatch({
				type: 'LOAD_FILES',
				data: results
			});
		});
	};
}

export function loadFileById(id) {
	return function (dispatch) {
		loadFile(id)
		.then(file => {
			dispatch({
				type: 'LOAD_FILE',
				data: file
			});
		});
	};
}
