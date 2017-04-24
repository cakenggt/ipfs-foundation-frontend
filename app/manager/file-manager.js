import {db, FILE, COMMENT} from '../dao/set-db-dao';

export function listFileNames() {
	return db.query(elem => elem.type === FILE)
	.map(elem => elem.name);
}

export function searchFileNameAndDescription(string) {
	string = string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	var regex = new RegExp('.*' + string + '.*', 'i');
	return db.query(elem => elem.type === FILE && (regex.test(elem.name) || regex.test(elem.description)));
}

export function searchFileNameAndDescriptionAndCategory(string, category) {
	string = string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
	var regex = new RegExp('.*' + string + '.*', 'i');
	return db.query(elem => elem.type === FILE && elem.category === category && (regex.test(elem.name) || regex.test(elem.description)));
}

export function searchNameOrHash(name, hash) {
	return db.query(elem => elem.type === FILE && (elem.name === name || elem._id === hash));
}

export function loadFile(id) {
	var file = db.get(id);
	if (file) {
		file.comments = db.query(elem => elem.type === COMMENT && elem.fileId === id);
	}
	return file;
}

export function addFile(file) {
	db.put(file);
}

export function addComment(comment) {
	comment._id = generateRandomId();
	db.put(comment);
}

function generateRandomId() {
	Math.floor(Math.random() * 9999999999999999999999).toString(36);
}
