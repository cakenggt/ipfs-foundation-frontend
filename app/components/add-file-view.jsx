import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {multihash} from 'is-ipfs';
import {postFile} from '../actionCreators/data-actions';
import {searchNameOrHash} from '../manager/file-manager';
import {FILE} from '../dao/set-db-dao';
import {categories} from '../settings';
import InfoRow from './info-row.jsx';

var AddFileView = withRouter(React.createClass({
	propTypes: {
		postFile: React.PropTypes.func,
		router: React.PropTypes.object
	},
	getInitialState: function () {
		return {
			message: '',
			name: '',
			description: '',
			category: categories[0],
			hash: ''
		};
	},
	render: function () {
		var categoryOptions = categories.map((elem, i) => {
			return (
				<option value={elem} key={i}>
					{elem}
				</option>
			);
		});
		var messageContainer = this.state.message ?
			<span>{this.state.message}</span> :
			null;
		var createStateInput = id => {
			var changeFunction = e => {
				var newState = {};
				newState[id] = e.target.value;
				this.setState(newState);
			};
			return (
				<input
					value={this.state[id]}
					onChange={changeFunction}
					/>
			);
		};
		var createStateTextArea = id => {
			var changeFunction = e => {
				var newState = {};
				newState[id] = e.target.value;
				this.setState(newState);
			};
			return (
				<textarea
					value={this.state[id]}
					onChange={changeFunction}
					/>
			);
		};
		var createStateSelect = (id, options) => {
			var changeFunction = e => {
				var newState = {};
				newState[id] = e.target.value;
				this.setState(newState);
			};
			return (
				<select
					value={this.state[id]}
					onChange={changeFunction}
					>{options}</select>
			);
		};
		return (
			<div
				className="bordered"
				>
				<InfoRow
					infoPairs={
					[
						{
							label: 'Name',
							info: createStateInput('name')
						},
						{
							label: 'Category',
							info: createStateSelect('category', categoryOptions)
						}
					]
					}
					/>
				<InfoRow
					infoPairs={
					[
						{
							label: 'Hash',
							info: createStateInput('hash')
						}
					]
					}
					/>
				<InfoRow
					infoPairs={
					[
						{
							label: 'Description',
							info: createStateTextArea('description')
						}
					]
					}
					/>
				<span
					className="btn"
					onClick={this.handleAddClick}
					>
					Add
				</span>{messageContainer}
			</div>
		);
	},
	handleAddClick: function () {
		// First check in db to see if name and hash are unique
		var file = {};
		file.name = this.state.name;
		file.description = this.state.description;
		file._id = this.state.hash;
		file.type = FILE;
		file.category = this.state.category;
		console.log(file);
		if (!file.name || !file.description) {
			this.setState({
				message: 'Files must have a name and a description'
			});
			return;
		}
		if (!multihash(file._id)) {
			this.setState({
				message: 'Not a valid multihash'
			});
			return;
		}
		searchNameOrHash(file.name, file._id)
		.then(result => {
			console.log('search result', result.length > 0);
			if (result.length === 0) {
				this.props.postFile(file, this.props.router);
			} else {
				this.setState({
					message: 'A file with this name or hash already exists on the server'
				});
			}
		});
	}
}));

var mapDispatchToProps = dispatch => {
	return {
		postFile: function (file, router) {
			dispatch(postFile(file, router));
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(AddFileView);
