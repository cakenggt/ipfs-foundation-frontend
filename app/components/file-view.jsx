import React from 'react';
import {connect} from 'react-redux';
import {loadFileById} from '../actionCreators/data-actions';
import InfoRow from './info-row.jsx';

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
					{elem.text}
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
							info: this.props.file.hash
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
						<a href={'/ipfs/' + this.props.file.hash} target="_blank" rel="noopener noreferrer">
							Download
						</a>
					</div>
				</div>
				{commentContainer}
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
