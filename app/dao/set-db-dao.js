import SetDB from 'set-db';
import {multihash} from 'is-ipfs';

const dbHashKey = 'the.index.db';
const dbTopic = process.env.NODE_ENV === 'development' ?
	'the.index.development' : 'the.index.production';

export const FILE = 'FILE';
export const COMMENT = 'COMMENT';

var dbHash = localStorage.getItem(dbHashKey);

const db = new SetDB(dbTopic, {
	dbHash: dbHash,
	validator: elem => {
		if (elem.type === 'FILE') {
			return multihash(elem._id) && elem.name && elem.description && elem.category;
		} else if (elem.type === 'COMMENT') {
			return multihash(elem.fileId) && elem.text;
		}
		return false;
	}
});

db.on('sync', () => {
	localStorage.setItem(dbHashKey, db.dbHash);
});

export const connect = new Promise((resolve, reject) => {
	db.on('ready', () => resolve(db));
	db.on('error', err => reject(err));
});
