import 'babel-polyfill';// eslint-disable-line import/no-unassigned-import
import React from 'react';
import {Router, Route, IndexRoute, hashHistory, IndexLink} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import ModalContainer from './components/modal-container.jsx';
import BrowseView from './components/browse-view.jsx';
import AddFileView from './components/add-file-view.jsx';
import FileView from './components/file-view.jsx';
import RedirectModal from './components/redirect-modal.jsx';
import dataReducer from './reducers/data-reducer';
import networkReducer from './reducers/network-reducer';
import modalReducer from './reducers/modal-reducer';
import {initData} from './actionCreators/data-actions';

var reducer = combineReducers({
	data: dataReducer,
	network: networkReducer,
	modal: modalReducer
});

var store = createStore(
	reducer,
	applyMiddleware(thunk)
);

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

var Index = connect(
	mapStateToProps,
	mapDispatchToProps
)(React.createClass({
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
							The Foundation
						</IndexLink>
					</h1>
					{inner}
				</ModalContainer>
			</div>
		);
	}
}));

var router = (
	<Router history={hashHistory}>
		<Route path="/" component={Index}>
			<IndexRoute component={BrowseView}/>
			<Route path="addFile/" component={AddFileView}/>
			<Route path="file/:id" component={FileView}/>
		</Route>
	</Router>
);

render(
	<Provider store={store}>{router}</Provider>,
	document.getElementById('app')
);
