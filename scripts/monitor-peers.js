var request = require('request');

var lastPeers = new Set();

setInterval(() => {
	var req = request.get('http://localhost:5001/api/v0/pubsub/peers?arg=the.index.production');
	req.on('data', message => {
		const json = JSON.parse(message.toString());
		const peers = json.Strings;
		var added = 0;
		var lost = 0;
		var newPeers = new Set(peers);
		newPeers.forEach(elem => {
			if (!lastPeers.has(elem)) {
				added++;
			}
		});
		lastPeers.forEach(elem => {
			if (!newPeers.has(elem)) {
				lost++;
			}
		});
		lastPeers = newPeers;
		if (added > 0 || lost > 0) {
			console.log(`Added: ${added}, Lost: ${lost}`);
		}
		req.abort();
	});
}, 5000);
