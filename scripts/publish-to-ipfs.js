var path = require('path');
var ipfsAPI = require('ipfs-api');

// Default settings
var ipfs = ipfsAPI();

// node id
var id;

ipfs.id()
.then(response => {
	id = response.id;
	console.log('id', id);
	return uploadToIPFS();
})
.catch(function (err) {
	console.log('error during main', err);
});

function uploadToIPFS() {
	var dirpath = path.resolve(__dirname, '..', 'public');
	console.log('dirpath', dirpath);
	return ipfs.util.addFromFs(dirpath, {recursive: true})
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
		console.log('error caught', err);
	});
}
