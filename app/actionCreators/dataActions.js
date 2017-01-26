import {searchFileNameAndDescription, fillDBs, loadFile} from '../manager/fileManager';
import {serverUrlProduction, serverUrlDevelopment} from '../settings';

const serverUrl = process.env.NODE_ENV === 'production' ?
  serverUrlProduction :
  serverUrlDevelopment;
const ipfsUrl = 'dump.json';

export function getData(){
  return function(dispatch, getState){
    fetch(`${serverUrl}/api/v1/dump`)
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      console.log(json);
      return fillDBs(json);
    })
    .catch(function (err) {
      console.log('error occurred during server get of dump, getting dump from ipfs', err);
      return fetch(ipfsUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        return fillDBs(json);
      })
      .catch(function (err) {
        console.log('error occurred during ipfs get of dump', err);
      });
    })
    .then(function(){
      dispatch({
        type: 'UPDATE_NETWORK_STATUS',
        data: 'DOWNLOADED'
      });
    });
  };
}

export function postFile(file, router){
  return function(dispatch){
    createPost(`${serverUrl}/api/v1/file`, file)
    .catch(function (err) {
      console.log('error in post', err);
    })
    .then(function () {
      dispatch(getData());
      router.replace('/');
    });
  }
}

function createPost(url, json) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    headers: {
      'content-type': 'application/json'
    }
  });
}

export function searchFiles(string){
  return function(dispatch) {
    searchFileNameAndDescription(string)
    .then(function (result) {
      dispatch({
        type: 'LOAD_FILES',
        data: result
      });
    });
  };
}

export function loadFileById(id) {
  return function(dispatch) {
    loadFile(id)
    .then(function (result) {
      dispatch({
        type: 'LOAD_FILE',
        data: result
      });
    });
  };
}
