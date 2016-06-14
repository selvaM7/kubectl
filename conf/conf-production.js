
module.exports = {

  api: {
    host: '0.0.0.0',
    port: '12000',routes: {
      cors: true
    }
  },

  database: {
    api: 'mongodb',
    host: '0.0.0.0',
    port: '12345',
    schema: 'geoservices',
    auth: false,
    username: '',
    password: ''
  },
  log: {

    logglyEnabled: true,
    logglyOptions: // To Configure Loggly Transport
    {
      level: "info",
      inputToken: "e6d0f173-1486-44d0-8528-a9a437daf82a",
      subdomain: "stestmar2t"
    },
    logEnabled: true,
    logOptions: {
      level: 'warn',
      colorize: true
    }
  }

};