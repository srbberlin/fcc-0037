'use strict';

const express           = require('express');
const app               = express();

//nst expect            = require('chai').expect;
//nst axios             = require('axios');

const apiRoutes         = require('./routes/api.js');
const runner            = require('./test-runner');

apiRoutes(app, express);

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
