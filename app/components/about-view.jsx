import React from 'react';

export default React.createClass({
	render: function () {
		return (
			<div>
				<h2>About</h2>
				<div>
          The Index is a metadata association service where you can associate an IPFS file hash with metadata describing it.

          <h3>How to use</h3>

          You need to set up your IPFS daemon in a special way in order to use this service. First, the following configurations need to be made.
          <pre>{`ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\\"*\\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\\"true\\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\\"PUT\\", \\"POST\\", \\"GET\\"]"`}</pre>

          Then you need to start up the daemon using the following command
          <pre>{`ipfs daemon --enable-pubsub-experiment`}</pre>
				</div>
			</div>
		);
	}
});
