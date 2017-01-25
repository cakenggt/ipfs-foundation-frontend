import React from 'react';
import {connect} from 'react-redux';
import {postFile} from '../actionCreators/dataActions';
import {searchNameOrHash} from '../manager/fileManager';

var AddFileView = React.createClass({
	render: function () {
		return (
			<div>
				<div>
					Name
					<input
						id="name"
					/>
				</div>
				<div>
					description
					<textarea
						id="description"
					/>
				</div>
				<div>
					Hash
					<input
						id="hash"
					/>
				</div>
				<span
					onClick={this.handleAddClick}>
					Add
				</span>
			</div>
		)
	},
	handleAddClick: function () {
		//First check in db to see if name and hash are unique
		var file = {};
		file.name = document.getElementById('name').value;
		file.description = document.getElementById('description').value;
		file.hash = document.getElementById('hash').value;
		console.log(file);
		searchNameOrHash(file.name, file.hash)
		.then(function (result) {
			console.log('search result', result.length > 0);
		});
	}
});

var mapDispatchToProps = (dispatch) => {
	return {
		postFile: function(file) {
			dispatch(postFile(file));
		}
	}
}

export default connect(
	null,
	mapDispatchToProps
)(AddFileView);
