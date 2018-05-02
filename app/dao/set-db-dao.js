import SetDB from 'set-db';
import {multihash} from 'is-ipfs';
import IPFS from 'ipfs';

const dbHashKey = 'the.index.db';
const dbTopic = process.env.NODE_ENV === 'development' ?
	'the.index.development' : 'the.index.production';

export const FILE = 'FILE';
export const COMMENT = 'COMMENT';

var dbHash = localStorage.getItem(dbHashKey);

const node = new IPFS({
	EXPERIMENTAL: {
		pubsub: true
	},
	config: {
		Addresses: {
			Swarm: [
				'/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
			]
		}
	}
});

export const connect = new Promise((resolve, reject) => {
	node.on('ready', () => {
		node.id().then(info => console.log('node id is', info.id));
		const db = new SetDB(dbTopic, {
			dbHash: dbHash,
			validator: elem => {
				if (elem.type === 'FILE') {
					return multihash(elem._id) && elem.name && elem.description && elem.category;
				} else if (elem.type === 'COMMENT') {
					return multihash(elem.fileId) && elem.text;
				}
				return false;
			},
			ipfs: node
		});

		let prevSync = setTimeout(() => db.ask(), 60000);
	
		db.on('sync', () => {
			localStorage.setItem(dbHashKey, db.dbHash);
			clearTimeout(prevSync);
			prevSync = setTimeout(() => db.ask(), 60000);
		});

		db.on('ready', () => {
			resolve(db)
		});
		db.on('error', err => reject(err));
	});
});
