import 'babel-polyfill';// eslint-disable-line import/no-unassigned-import
import React from 'react';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import IndexView from './components/index-view.jsx';
import BrowseView from './components/browse-view.jsx';
import AddFileView from './components/add-file-view.jsx';
import FileView from './components/file-view.jsx';
import dataReducer from './reducers/data-reducer';
import modalReducer from './reducers/modal-reducer';

var reducer = combineReducers({
	data: dataReducer,
	modal: modalReducer
});

var store = createStore(
	reducer,
	applyMiddleware(thunk)
);

var router = (
	<Router history={hashHistory}>
		<Route path="/" component={IndexView}>
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
