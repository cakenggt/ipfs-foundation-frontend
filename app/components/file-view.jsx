import React from 'react';
import {connect} from 'react-redux';
import {loadFileById} from '../actionCreators/data-actions';

var FileView = React.createClass({
	propTypes: {
		loadFile: React.PropTypes.func,
		file: React.PropTypes.object,
		params: React.PropTypes.object
	},
	componentDidMount: function () {
		this.props.loadFile(this.props.params.id);
	},
	render: function () {
		if (this.props.file === null) {
			return null;
		}
		var comments = this.props.file.comments.map((elem, i) => {
			return (
				<div key={i}>
					{elem.id} {elem.text}
				</div>
			);
		});
		var commentContainer = comments.length ?
			(<div>
				<h3>Comments</h3>
				{comments}
			</div>) :
			null;
		return (
			<div
				className="bordered"
				>
				<div>
					Id: {this.props.file.id}
				</div>
				<div>
					Name: {this.props.file.name}
				</div>
				<div>
					description: {this.props.file.description}
				</div>
				<div>
					hash: {this.props.file.hash}
				</div>
				<div>
					category: {this.props.file.category}
				</div>
				<div>
					<div>
						<a href={'/ipfs/' + this.props.file.hash} target="_blank" rel="noopener noreferrer">
							Download link
						</a>
					</div>
					<div>
						<a href={'https://ipfs.io/ipfs/' + this.props.file.hash} target="_blank" rel="noopener noreferrer">
							Download link for ipfs.io
						</a>
					</div>
				</div>
				<div>
					{commentContainer}
				</div>
			</div>
		);
	}
});

var mapStateToProps = state => {
	return {
		file: state.data.file
	};
};

var mapDispatchToProps = dispatch => {
	return {
		loadFile: function (id) {
			dispatch(loadFileById(id));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FileView);
