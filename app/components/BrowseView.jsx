import React from 'react';
import {connect} from 'react-redux';
import {searchFiles} from '../actionCreators/dataActions';

var BrowseView = React.createClass({
	render: function () {
		var fileNames = this.props.files.map((elem, i) => {
      return (
        <div key={i}>
          {elem.name}
        </div>
      )
    });
		var fileNameContainer = fileNames.length ?
			<div>
				{fileNames}
			</div> :
			<div>
				No Search Results
			</div>
		return (
			<div>
				<input
					onKeyPress={this.handleSearchKey}
					placeholder="Search Here"
					/>
				<div>
					{fileNameContainer}
				</div>
			</div>
		)
	},
	handleSearchKey: function (e) {
		if (e.key === 'Enter') {
			this.props.searchFiles(e.target.value);
		}
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
