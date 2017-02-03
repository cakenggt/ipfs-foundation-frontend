import React from 'react';
import {connect} from 'react-redux';
import {postComment} from '../actionCreators/data-actions';

var AddComment = React.createClass({
	propTypes: {
		postComment: React.PropTypes.func,
		fileId: React.PropTypes.string
	},
	getInitialState: function () {
		return {
			comment: ''
		};
	},
	render: function () {
		return (
			<div
				className="input-container"
				>
				<input
					value={this.state.comment}
					onChange={this.handleCommentChange}
					onKeyPress={this.handleCommentKeyPress}
					placeholder="Add a comment..."
					/>
				<span
					className="btn"
					onClick={this.handlePostComment}
					>Post</span>
			</div>
		);
	},
	handleCommentChange: function (e) {
		this.setState({
			comment: e.target.value
		});
	},
	handleCommentKeyPress: function (e) {
		if (e.key === 'Enter') {
			this.handlePostComment();
		}
	},
	handlePostComment: function () {
		this.props.postComment({
			text: this.state.comment,
			fileId: this.props.fileId
		});
		this.setState({
			comment: ''
		});
	}
});

var mapDispatchToProps = dispatch => {
	return {
		postComment: function (comment) {
			dispatch(postComment(comment));
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(AddComment);
