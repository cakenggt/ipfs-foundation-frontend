import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, hashHistory, Link, IndexLink} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import BrowseView from './components/BrowseView.jsx';
import AddFileView from './components/AddFileView.jsx';
import FileView from './components/FileView.jsx';
import dataReducer from './reducers/dataReducer.js';
import {getData} from './actionCreators/dataActions.js';

var reducer = combineReducers({
  data: dataReducer
});

var store = createStore(
  reducer,
  applyMiddleware(thunk)
);

var mapDispatchToProps = (dispatch) => {
  return {
    getData: function(){
      dispatch(getData());
    }
  }
}

var Index = connect(
  null,
  mapDispatchToProps
)(React.createClass({
  componentDidMount: function() {
    this.props.getData();
  },
  render: function() {
    return (
      <div>
        <IndexLink to="/"><h1>The Foundation</h1></IndexLink>
        <ul>
          <Link to="/addFile/">Add File</Link>
        </ul>
        {this.props.children}
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
