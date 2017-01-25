var ipfsAPI = require('ipfs-api');
var path = require('path');
var fs = require('fs');
var fetch = require('node-fetch');

// Default settings
var ipfs = ipfsAPI();

// node id
var id;

ipfs.id()
.then(response => {
	id = response.id;
	console.log('id', id);
	console.log('getting current dump');
	var serverUrl = process.env.NODE_ENV === 'production' ?
		'https://ipfs-federation.herokuapp.com' :
		'http://localhost:4000';
	return fetch(`${serverUrl}/api/v1/dump`)
	.then(function (res) {
		return res.json();
	})
	.then(function (json) {
		console.log(json);
		fs.writeFileSync(path.resolve(__dirname, '..', 'public', 'dump.json'), json);
	})
	.catch(function (err) {
		console.log('server dump get failed, not writing to dump.json');
		console.log(err);
	})
})
.then(() => {
	var dirpath = path.resolve(__dirname, '..', 'public');
	console.log('dirpath', dirpath);
	return ipfs.util.addFromFs(dirpath, {recursive: true});
})
.then(result => {
	console.log('length of result', result.length);
	/*
	 * To combat the following bug, we are searching for
	 * the path which starts at public and publishing
	 * that one, instead of the erronious almost-root
	 * path.
	 * https://github.com/ipfs/js-ipfs-api/issues/408
	 */
	var lastHash;
	for (var i = 0; i < result.length; i++) {
		var file = result[i];
		if (/\/public$/.test(file.path)) {
			lastHash = file.hash;
			break;
		}
	}
	console.log('lashHash', lastHash);
	return ipfs.name.publish(lastHash);
})
.then(() => {
	console.log(`published at http://localhost:8080/ipns/${id} and
https://ipfs.io/ipns/${id}`);
})
.catch(err => {
	console.log('error caught');
	console.log(err);
});
