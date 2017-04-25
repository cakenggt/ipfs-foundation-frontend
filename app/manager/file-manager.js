import {connect, FILE, COMMENT} from '../dao/set-db-dao';

export function listFileNames() {
	return connect
	.then(db => {
		return db.query(elem => elem.type === FILE)
		.map(elem => elem.name);
	});
}

export function searchFileNameAndDescription(string) {
	string = string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	var regex = new RegExp('.*' + string + '.*', 'i');
	return connect
	.then(db => {
		return db.query(elem => elem.type === FILE && (regex.test(elem.name) || regex.test(elem.description)));
	});
}

export function searchFileNameAndDescriptionAndCategory(string, category) {
	string = string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	var regex = new RegExp('.*' + string + '.*', 'i');
	return connect
	.then(db => {
		return db.query(elem => elem.type === FILE && elem.category === category && (regex.test(elem.name) || regex.test(elem.description)));
	});
}

export function searchNameOrHash(name, hash) {
	return connect
	.then(db => {
		return db.query(elem => elem.type === FILE && (elem.name === name || elem._id === hash));
	});
}

export function loadFile(id) {
	return connect
	.then(db => {
		var file = db.get(id);
		if (file) {
			file.comments = db.query(elem => elem.type === COMMENT && elem.fileId === id);
		}
		return file;
	});
}

export function addFile(file) {
	return connect
	.then(db => {
		db.put(file);
	});
}

export function addComment(comment) {
	return connect
	.then(db => {
		comment._id = generateRandomId();
		db.put(comment);
	});
}

function generateRandomId() {
	return Math.floor(Math.random() * 9999999999999999999999).toString(36);
}
