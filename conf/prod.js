
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
    schema: 'geoservice',
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
  },
  service : {
    //Url:"geocoder"
    Url:"amps"
    //Url:"maps"

    /*googleRGSUrl :
     "http://geocoder.tmatics.com/location/reverse?"
     "http://amps.tmatics.com/geoservice/services/google/maps/api/geocode/json?latlng="+latlng+"&sensor=false&max_tries=3";
     "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&sensor=false";
     "http://geocoder.tmatics.com/location/reverse?latitude="+latitude+"&longitude="+longitude;*/
  }

};