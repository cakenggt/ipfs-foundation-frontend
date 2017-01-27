import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, hashHistory, IndexLink} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import BrowseView from './components/BrowseView.jsx';
import AddFileView from './components/AddFileView.jsx';
import FileView from './components/FileView.jsx';
import dataReducer from './reducers/dataReducer.js';
import networkReducer from './reducers/networkReducer.js';
import {getData} from './actionCreators/dataActions.js';

var reducer = combineReducers({
  data: dataReducer,
  network: networkReducer
});

var store = createStore(
  reducer,
  applyMiddleware(thunk)
);

var mapStateToProps = (state) => {
  return {
    status: state.network.status
  };
}

var mapDispatchToProps = (dispatch) => {
  return {
    getData: function(){
      dispatch(getData());
    }
  }
}

var Index = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.createClass({
  componentDidMount: function() {
    this.props.getData();
  },
  render: function() {
    var inner = this.props.status === 'PENDING' ?
      <div>
        DB Loading...
      </div> :
      this.props.children;
    return (
      <div
        className="container">
        <h1>
          <IndexLink
            to="/"
            className="link"
            >
            The Foundation
          </IndexLink>
        </h1>
        {inner}
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
