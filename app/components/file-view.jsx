import React from 'react';
import {connect} from 'react-redux';
import {loadFileById} from '../actionCreators/data-actions';
import InfoRow from './info-row.jsx';
import AddComment from './add-comment.jsx';

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
				<div
					className="comment"
					key={i}
					>
					{elem.text}
				</div>
			);
		});
		return (
			<div>
				<div
					className="bordered"
					>
					<InfoRow
						infoPairs={
						[
							{
								label: 'Name',
								info: this.props.file.name
							},
							{
								label: 'Category',
								info: this.props.file.category
							}
						]
						}
						/>
					<InfoRow
						infoPairs={
						[
							{
								label: 'Hash',
								info: this.props.file._id
							}
						]
						}
						/>
					<InfoRow
						infoPairs={
						[
							{
								label: 'Description',
								info: <div className="description">{this.props.file.description}</div>
							}
						]
						}
						/>
					<div>
						<div>
							<a
								href={'/ipfs/' + this.props.file._id}
								target="_blank"
								rel="noopener noreferrer"
								className="download"
								>
								Download
							</a>
						</div>
					</div>
				</div>
				<div
					className="bordered"
					>
					<h3>Comments</h3>
					{comments}
					<AddComment
						fileId={this.props.params.id}
						/>
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
