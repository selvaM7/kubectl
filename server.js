

/*******************************************************************************************
 * Required module
 ******************************************************************************************/
var conf = require('./conf.js');

/*******************************************************************************************
 * Required libs
 ******************************************************************************************/
var Hapi = require('hapi');
var Good = require('good');

/*******************************************************************************************
 * HTTP Server Startup
 ******************************************************************************************/

var app = {};

app['conf'] = conf;

try {

  var server = new Hapi.Server();
  server.connection(app.conf.api);
  server.register({
    register: Good,
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: {
          response: '*',
          log: '*'
        }
      }]
    }
  }, function(err) {
    if (err) {
      throw err; // something bad happened loading the plugin
    }

  });
  server.start(function() {
    console.log("Hapi server started @ " + server.info.uri);
  });
  app.server = server;
}
catch (err) {
  console.log('Error @ HTTP Server Initialization : ' + err);
}




/********************************************************************************************
 tlogger Initialisation
 *******************************************************************************************/
var Tlogger = require('tlogger');
var tlogger = new Tlogger(conf['log']);
app.tlogger = tlogger.init();


/*******************************************************************************************
 * Database Initialization
 ******************************************************************************************/
var mongoDb = require('tdatadriver').mongo;
var Promise = require('bluebird');

try {
  mongoDb.connect(conf.database);
  app['mongoDb'] = mongoDb;
  app.mongoDb = Promise.promisifyAll(app.mongoDb);
}
catch (err) {
  console.log('Error @ Database Connection Initialization : ' + err);
}


/*******************************************************************************************
 * Global Exception Handler
 ******************************************************************************************/
process.on('uncaughtException', function (err) {
  console.log('Exception handled @ [' + MODULE + '] uncaughtException' + err.stack);
});

/****************************************************************************************
 * Routes Initialization
 * **************************************************************************************/

var Routes = require('./routes/routes.js');
var routeInstance = new Routes(app);
routeInstance.init();
