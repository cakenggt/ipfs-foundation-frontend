/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {connect} from 'react-redux';
/* eslint-enable import/no-extraneous-dependencies */

const ModalContainer = React.createClass({
	propTypes: {
		onLeave: React.PropTypes.func,
		modal: React.PropTypes.node,
		children: React.PropTypes.array,
		removeModal: React.PropTypes.func
	},
	render: function () {
		var className = this.props.modal ?
			'blur' :
			'';
		var modal = this.props.modal ?
			(<div
				className="modal"
				onClick={this.handleOuterClick}
				>
				<div
					onClick={this.handleInnerClick}
					>
					{this.props.modal}
				</div>
			</div>) :
			null;
		return (
			<div
				className="modal-container"
				>
				<div
					className={className}
					>
					{this.props.children}
				</div>
				{modal}
			</div>
		);
	},
	handleOuterClick: function () {
		if (this.props.onLeave) {
			this.props.onLeave();
		} else {
			this.props.removeModal();
		}
	},
	handleInnerClick: function (e) {
		e.stopPropagation();
	}
});

var mapDispatchToProps = dispatch => {
	return {
		removeModal: () => {
			dispatch({
				type: 'REMOVE_MODAL'
			});
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(ModalContainer);
