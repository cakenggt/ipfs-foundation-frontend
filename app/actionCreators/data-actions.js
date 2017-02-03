import {
	searchFileNameAndDescription,
	searchFileNameAndDescriptionAndCategory,
	fillDBs,
	loadFile
} from '../manager/file-manager';
import {serverUrlProduction, serverUrlDevelopment, ipnsURL} from '../settings';

const serverUrl = process.env.NODE_ENV === 'production' ?
	serverUrlProduction :
	serverUrlDevelopment;
const ipfsUrl = 'dump.json';

export function getData() {
	return function (dispatch) {
		fetch(`${serverUrl}/api/v1/dump`)
		.then(function (res) {
			return res.json();
		})
		.then(function (json) {
			console.log(json);
			return fillDBs(json);
		})
		.catch(function (err) {
			console.log('error occurred during server get of dump, getting dump from ipfs', err);
			return fetch(ipfsUrl)
			.then(function (res) {
				return res.json();
			})
			.then(function (json) {
				return fillDBs(json);
			})
			.catch(function (err) {
				console.log('error occurred during ipfs get of dump', err);
			});
		})
		.then(function () {
			dispatch({
				type: 'UPDATE_NETWORK_STATUS',
				data: 'DOWNLOADED'
			});
		});
	};
}

export function initData() {
	return function (dispatch) {
		dispatch(getData());
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
	return function (dispatch) {
		router.replace('/');
		createPost(`${serverUrl}/api/v1/file`, file)
		.catch(function (err) {
			console.log('error in post', err);
		})
		.then(function () {
			// Refresh the db with data from online
			dispatch(getData());
		});
	};
}

export function postComment(comment) {
	return function (dispatch) {
		createPost(`${serverUrl}/api/v1/comment`, comment)
		.catch(function (err) {
			console.log('error in post', err);
		})
		.then(function () {
			// Add the comment to the screen immediately so the user thinks they posted
			dispatch({
				type: 'ADD_COMMENT',
				data: comment
			});
			dispatch(getData());
		});
	};
}

function createPost(url, json) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(json),
		headers: {
			'content-type': 'application/json'
		}
	});
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
		.then(function (result) {
			dispatch({
				type: 'LOAD_FILES',
				data: result
			});
		});
	};
}

export function loadFileById(id) {
	return function (dispatch) {
		loadFile(id)
		.then(function (result) {
			dispatch({
				type: 'LOAD_FILE',
				data: result
			});
		});
	};
}
