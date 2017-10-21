'use strict';

// Third party modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const __ = require('underscore');
const mysql = require('mysql');

// Configuration
const config = {
  port: 3000,
  ip: '127.0.0.1'
};

// DB configuration
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'test@123',
  database: 'test'
};

let connection = mysql.createConnection(dbConfig);

// Initializing app
let app = express();

// Enable cors support
app.use(cors());

// parse application/json
app.use(bodyParser.json())

app.listen(config.port, config.ip, function (err) {
  if (err) {
    console.log(err);
    process.exit(10);
  }
  console.log(`Server is listening on http://${config.ip}:${config.port}`);
});

// Route to store data series in the database
app.post('/register', function (request, response) {
  let data = request.body;
  let query = `INSERT INTO user (name, email, gender) VALUES 
    (?, ?, ?);`;
  connection.query(query, [data.name, data.email, data.gender], function (err, results) {
    sendResponse(err, data, response);
  });
});

// Route to test whether we are able to connect to API or not
app.get('/test', function (request, response) {
  sendResponse(null, '[Amazon EC2] - Hurrah!!! Your request has been launched on the server app.', response);
});

// Handles success and error response
function sendResponse (err, data, response) {
  if (err) {
    console.log(err);
    response.format({
      'application/json': function () {
        response.status(500).json({
          'status': 'fail',
          'data': {},
          'message': err.message
        });
      }
    });
  } else {
    response.format({
      'application/json': function () {
        response.status(200).json({
          'status': 'success',
          'data': data
        });
      }
    });
  }
}