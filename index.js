'use strict';

const path = require('path');
const httpLib = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const http = httpLib.Server(app);// eslint-disable-line new-cap

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Deliver the public folder statically
app.use(express.static('public'));

// This tells the server to listen
var port = 3000;
http.listen(port, function () {
	console.log('Example app listening on port ' + port + '!');
});

/*
* This tells the server to always serve index.html no matter what,
* excluding the previously defined api routes. This is so we can use
* react-router's browserHistory feature.
*/
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});
