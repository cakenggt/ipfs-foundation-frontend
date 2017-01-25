import {searchFileNameAndDescription, fillDBs} from '../manager/fileManager';

const serverUrl = process.env.NODE_ENV === 'production' ?
  'https://ipfs-federation.herokuapp.com' :
  'http://localhost:4000';
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
    });
  };
}

export function postFile(file){
  return function(dispatch){
    createPost(`${serverUrl}/api/v1/file`, file)
    .catch(function (err) {
      console.log('error in post', err);
    })
    .then(function () {
      dispatch(getData());
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
