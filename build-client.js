var conf = {};
/*******************************************************************************************
 * Environmental Arguments
 ******************************************************************************************/

var ENV = process.env.ENV ? process.env.ENV : 'dev';
var file = __dirname+'/swagger.json';
var path = __dirname;
var repoTeamName = "client_microservice_"+ENV;

conf['ENV'] = ENV;
conf['file'] = file;
conf['path'] = path;
conf['repoTeamName'] = repoTeamName;

var BuildClient = require("tbuild-client");
new BuildClient(conf);
