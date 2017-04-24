import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {categories} from '../settings';
import {searchFiles} from '../actionCreators/data-actions';

var BrowseView = React.createClass({
	propTypes: {
		files: React.PropTypes.array,
		searchFiles: React.PropTypes.func
	},
	getInitialState: function () {
		return {
			search: '',
			placeholder: 'Search Here',
			category: ''
		};
	},
	componentDidMount: function () {
		this.searchInput.focus();
	},
	render: function () {
		var files = this.props.files.map((elem, i) => {
			var className = i % 2 === 0 ?
				'row' :
				'row alt-row';
			return (
				<Link key={i} to={'/file/' + elem._id}>
					<div className={className}>
						{elem.name}
					</div>
				</Link>
			);
		});
		var fileContainer = files.length ?
			(<div
				className="bordered browse-results"
				>
				{files}
			</div>) :
			(<div
				className="bordered"
				>
				No Search Results
			</div>);
		var allOption = [<option value="" key={-1}>All</option>];
		var categoryOptions = allOption.concat(categories.map((elem, i) => {
			return (
				<option value={elem} key={i}>
					{elem}
				</option>
			);
		}));
		return (
			<div>
				<div className="nav">
					<Link to="/addFile/">Add File</Link>
					<Link to="/about/">About</Link>
				</div>
				<div
					className="input-container"
					>
					<input
						value={this.state.search}
						onKeyPress={this.handleSearchKey}
						onChange={this.handleSearchChange}
						placeholder={this.state.placeholder}
						ref={this.addSearchReference}
						/>
					<select
						onChange={this.handleCategoryChange}
						value={this.state.category}
						>
						{categoryOptions}
					</select>
					<span
						className="btn"
						onClick={this.handleSearchClick}
						>Search</span>
				</div>
				<div>
					{fileContainer}
				</div>
			</div>
		);
	},
	addSearchReference: function (input) {
		this.searchInput = input;
	},
	handleSearchKey: function (e) {
		if (e.key === 'Enter') {
			this.search();
		}
	},
	handleSearchClick: function () {
		this.search();
	},
	search: function () {
		this.props.searchFiles(this.state.search, this.state.category);
		this.setState({
			search: '',
			placeholder: this.state.search
		});
	},
	handleSearchChange: function (e) {
		this.setState({
			search: e.target.value
		});
	},
	handleCategoryChange: function (e) {
		this.setState({
			category: e.target.value
		});
	}
});

var mapStateToProps = state => {
	return {
		files: state.data.files
	};
};

var mapDispatchToProps = dispatch => {
	return {
		searchFiles: function (string, category) {
			dispatch(searchFiles(string, category));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BrowseView);
