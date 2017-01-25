import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import dataReducer from './reducers/dataReducer.js';
import {getData} from './actionCreators/dataActions.js';

var reducer = combineReducers({
  data: dataReducer
});

var store = createStore(
  reducer,
  applyMiddleware(thunk)
);


var mapStateToProps = (state) => {
  return {
    files: state.data.files
  }
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
    var fileNames = this.props.files.map((elem, i) => {
      return (
        <div key={i}>
          {elem.name}
        </div>
      )
    });
    return (
      <div>
        {fileNames}
      </div>
    );
  }
}));

var router = (
  <Router history={browserHistory}>
    <Route path="/" >
      <IndexRoute component={Index}/>
    </Route>
  </Router>
);

render(
  <Provider store={store}>{router}</Provider>,
  document.getElementById('app')
);
