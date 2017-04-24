import React from 'react';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router';
import ModalContainer from '../components/modal-container.jsx';
import RedirectModal from '../components/redirect-modal.jsx';
import SetupModal from '../components/setup-modal.jsx';
import {initData} from '../actionCreators/data-actions';

var mapStateToProps = state => {
	return {
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
		modal: React.PropTypes.node
	},
	componentDidMount: function () {
		this.props.getData();
	},
	render: function () {
		var modal;
		switch (this.props.modal) {
			case 'REDIRECT':
				modal = <RedirectModal/>;
				break;
			case 'SETUP':
				modal = <SetupModal/>;
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
							The Index
						</IndexLink>
					</h1>
					{this.props.children}
				</ModalContainer>
			</div>
		);
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IndexView);
