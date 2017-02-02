import React from 'react';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router';
import ModalContainer from '../components/modal-container.jsx';
import RedirectModal from '../components/redirect-modal.jsx';
import {initData} from '../actionCreators/data-actions';

var mapStateToProps = state => {
	return {
		status: state.network.status,
		modal: state.modal.modal
	};
};

var mapDispatchToProps = dispatch => {
	return {
		getData: function () {
			dispatch(initData());
		}
	};
};

var IndexView = React.createClass({
	propTypes: {
		getData: React.PropTypes.func,
		children: React.PropTypes.object,
		status: React.PropTypes.string,
		modal: React.PropTypes.node
	},
	componentDidMount: function () {
		this.props.getData();
	},
	render: function () {
		var inner = this.props.status === 'PENDING' ?
			(<div>
				DB Loading...
			</div>) :
			this.props.children;
		var modal;
		switch (this.props.modal) {
			case 'REDIRECT':
				modal = <RedirectModal/>;
				break;
			default:
				modal = null;
		}
		return (
			<div
				className="container"
				>
				<ModalContainer
					modal={modal}
					>
					<h1>
						<IndexLink
							to="/"
							>
							Akasha
						</IndexLink>
					</h1>
					{inner}
				</ModalContainer>
			</div>
		);
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IndexView);
