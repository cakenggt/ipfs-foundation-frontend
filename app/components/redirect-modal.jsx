import React from 'react';
import {connect} from 'react-redux';
import {ipnsURL} from '../settings';

var RedirectModal = React.createClass({
	propTypes: {
		removeModal: React.PropTypes.func
	},
	render: function () {
		return (
			<div
				className="bordered"
				>
				<div>
					There is an updated version of this site.
				</div>
				<div>
					Do you wish to navigate there?
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between'
					}}
					>
					<span
						className="fleft btn"
						onClick={this.handleClickYes}
						>
						Yes
					</span>
					<span
						className="fright btn"
						onClick={this.handleClickNo}
						>
						No
					</span>
				</div>
			</div>
		);
	},
	handleClickYes: function () {
		window.location.pathname = ipnsURL;
	},
	handleClickNo: function () {
		this.props.removeModal();
	}
});

var mapDispatchToProps = dispatch => {
	return {
		removeModal: function () {
			dispatch({
				type: 'REMOVE_MODAL'
			});
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(RedirectModal);
