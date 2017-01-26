import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {searchFiles} from '../actionCreators/dataActions';

var BrowseView = React.createClass({
	getInitialState: function () {
		return {
			search: ''
		}
	},
	componentDidMount: function() {
		this.searchInput.focus();
	},
	render: function () {
		var files = this.props.files.map((elem, i) => {
			var className = i%2 === 0 ?
				'row' :
				'row alt-row';
      return (
				<Link key={i} to={'/file/'+elem.id}>
	        <div className={className}>
	          {elem.name}
	        </div>
				</Link>
      )
    });
		var fileContainer = files.length ?
			<div
				className="bordered browse-results">
				{files}
			</div> :
			<div
				className="bordered">
				No Search Results
			</div>
		return (
			<div>
				<div>
					<Link className="link" to="/addFile/">Add File</Link>
				</div>
				<div
					className="search-container">
					<input
						value={this.state.search}
						onKeyPress={this.handleSearchKey}
						onChange={this.handleSearchChange}
						placeholder="Search Here"
						ref={input => this.searchInput = input}
						/>
					<span
						className="btn"
						onClick={this.handleSearchClick}
						>Search</span>
				</div>
				<div>
					{fileContainer}
				</div>
			</div>
		)
	},
	handleSearchKey: function (e) {
		if (e.key === 'Enter') {
			this.setState({
				search: ''
			});
			this.props.searchFiles(e.target.value);
		}
	},
	handleSearchClick: function () {
		this.setState({
			search: ''
		});
		this.props.searchFiles(e.target.value);
	},
	handleSearchChange: function (e) {
		this.setState({
			search: e.target.value
		});
	}
});

var mapStateToProps = (state) => {
  return {
    files: state.data.files
  }
}

var mapDispatchToProps = (dispatch) => {
	return {
		searchFiles: function(string) {
			dispatch(searchFiles(string));
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BrowseView);
