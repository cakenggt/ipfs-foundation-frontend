var path = require('path');
var fs = require('fs');
var ipfsAPI = require('ipfs-api');
var fetch = require('node-fetch');
var inquirer = require('inquirer');

var settings = require('../app/settings');

// Default settings
var ipfs = ipfsAPI();

// Previous dump
var prevDump;
try {
	prevDump = require('../public/dump.json');
} catch (err) {
	prevDump = {files: [], comments: []};
}

var newDump;

// node id
var id;

ipfs.id()
.then(response => {
	id = response.id;
	console.log('id', id);
	console.log('getting current dump from', process.env.NODE_ENV);
	var serverUrl = process.env.NODE_ENV === 'production' ?
		settings.serverUrlProduction :
		settings.serverUrlDevelopment;
	return fetch(`${serverUrl}/api/v1/dump`);
})
.then(function (res) {
	return res.json();
})
.catch(function (err) {
	console.log('server dump get failed, using old dump', err);
	return prevDump;
})
.then(function (json) {
	console.log(json);
	newDump = json;
	compareDumps(prevDump, newDump);
	return inquirer.prompt([
		{
			type: 'confirm',
			name: 'overwrite',
			message: 'Do you wish to overwrite the previous dump?'
		},
		{
			type: 'confirm',
			name: 'upload',
			message: 'Do you wish to upload to IPFS?'
		}
	]);
})
.then(function (result) {
	if (result.overwrite) {
		fs.writeFileSync(
			path.resolve(__dirname, '..', 'public', 'dump.json'),
			JSON.stringify(newDump)
		);
	}
	if (result.upload) {
		return uploadToIPFS();
	}
})
.catch(function (err) {
	console.log('error during main', err);
});

function compareDumps(prevDump, newDump) {
	var filesMap = {};
	var newNum = 0;
	var errorNum = 0;
	for (let i = 0; i < prevDump.files.length; i++) {
		let file = prevDump.files[i];
		filesMap[file.id] = file;
	}
	for (let i = 0; i < newDump.files.length; i++) {
		let file = newDump.files[i];
		if (filesMap[file.id]) {
			var compFile = filesMap[file.id];
			if (file.hash !== compFile.hash) {
				errorNum++;
				console.log('not equal', file, compFile);
			}
		}		else {
			newNum++;
		}
	}
	console.log(`New: ${newNum}, Errors: ${errorNum}`);
}

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
