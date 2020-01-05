/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const bodyParser        = require('body-parser');
const cors              = require('cors');
const helmet            = require('helmet');
const dbRoute           = require('../db/db.js');
const fccTestingRoutes  = require('../routes/fcctesting.js');

module.exports = function (app, express) {

  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"]//,
      //scriptSrc: ["'self'", 'https://code.jquery.com'],
      //imgSrc: ["'self'", 'https://hyperdev.com/favicon-app.ico', 'http://glitch.com/favicon-app.ico']
    }
  }));
  app.use(cors({origin: '*'})); //For FCC testing purposes only
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //For FCC testing purposes
  fccTestingRoutes(app);
  
  dbRoute(app.route('/api/stock-prices'));

  //Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    });

  app.use('/public', express.static(process.cwd() + '/public'));
  
  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
};
