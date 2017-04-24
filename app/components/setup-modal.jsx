import React from 'react';
import {connect} from 'react-redux';

var SetupModal = React.createClass({
	propTypes: {
		removeModal: React.PropTypes.func
	},
	render: function () {
		return (
			<div
				className="bordered"
				>
				<div>
					Your ipfs daemon is not set up to run this site. Run the following commands and start your daemon using the last command
				</div>
				<pre>{`ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\\"*\\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\\"true\\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\\"PUT\\", \\"POST\\", \\"GET\\"]"
ipfs daemon --enable-pubsub-experiment`}</pre>
			</div>
		);
	}
});

export default connect(
	null,
	null
)(SetupModal);
