/************************************************************************
 * Required Modules
 * **********************************************************************/
var ApiService = require('../services/api-service.js');
var Promise = require('bluebird');
var async = require('async');
var request = require('request');

/************************************************************************
 * Class Declaration
 * **********************************************************************/
var APIAction = function (app) {
    this.app = app;
    this.conf = app.conf;
    this.tlogger = app.tlogger;
    this.apiServiceInstance = new ApiService(app);
    this.apiService = Promise.promisifyAll(this.apiServiceInstance);
    this.async = Promise.promisifyAll(async);
};

module.exports = APIAction;

APIAction.prototype.getAddress = function (reqObj) {

    var self = this;
    var response = {
        address: {
            status: false,
            err: null,
            data: {}
        }
    };


    var input;
    if (reqObj && reqObj.query) {
        input = reqObj.query
    } else {
        input = reqObj
    }

    return new Promise(function (resolve, reject) {
        if (input) {
            if (input.serviceName && input.serviceName == 'google') {
                self.getAddressUsingGoogle(input)
                    .then(function (addressUsingGoogle) {
                        if (addressUsingGoogle && addressUsingGoogle != null) {
                            console.log("enter resolve Data");
                            response.address['data'] = addressUsingGoogle
                            resolve(response)
                        } else {
                            console.log("enter resolve NULL");

                            resolve(response)
                        }
                    }).catch(function (e) {
                        console.log("enter error");
                        response.address['err'] = e;
                        reject(response)
                    })
            }
            else if (input.serviceName && input.serviceName == 'geonames') {

                self.getAddressUsingGeonames(input)
                    .then(function (addressUsingGeonames) {
                        if (addressUsingGeonames && addressUsingGeonames != null) {
                            console.log("enter resolve Data");
                            response.address['data'] = addressUsingGeonames
                            resolve(response)
                        } else {
                            console.log("enter resolve NULL");

                            resolve(response)
                        }
                    }).catch(function (e) {
                        console.log("enter error");
                        response.address['err'] = e;
                        reject(response)
                    })


            }
            else if (input.serviceName && input.serviceName == 'where') {

                self.getAddressUsingWhere(input)
                    .then(function (addressUsingWhere) {
                        if (addressUsingWhere && addressUsingWhere != null) {
                            console.log("enter resolve Data");
                            response.address['data'] = addressUsingWhere
                            resolve(response)
                        } else {
                            console.log("enter resolve NULL");

                            resolve(response)
                        }
                    }).catch(function (e) {
                        console.log("enter error");
                        response.address['err'] = e;
                        reject(response)
                    })

            } else {
                self.getAddressUsingGoogle(input)
                    .then(function (addressUsingGoogle) {
                        if (addressUsingGoogle && addressUsingGoogle != null) {
                            console.log("enter resolve Data");
                            response.address['data'] = addressUsingGoogle
                            resolve(response)
                        } else {
                            console.log("enter resolve NULL");

                            resolve(response)
                        }
                    }).catch(function (e) {
                        console.log("enter error");
                        response.address['err'] = e;
                        reject(response)
                    })
            }


        } else {
            response = {
                address: {
                    status: "ERROR",
                    error: {
                        type: "INVALID_REQUEST_ERROR",
                        code: "E200",
                        Message: "Invalid service Type"
                    }
                }
            };
            reject(response)
        }
    })
};


/******************************************************************************************
 * Function to get Reverse Geo coder data using google service
 ******************************************************************************************/


APIAction.prototype.getAddressUsingGoogle = function (input) {
    var self = this;
    var response = {};
    var latitude = input.latitude ? input.latitude : 0
    var longitude = input.longitude ? input.longitude : 0

    var latlng = latitude + "," + longitude;

    var googleRGSUrl = "http://geocoder.tmatics.com/location/reverse?latitude=" + latitude + "&longitude=" + longitude
    //var googleRGSUrl = "http://amps.tmatics.com/geoservice/services/google/maps/api/geocode/json?latlng="+latlng+"&sensor=false&max_tries=3";
//	var googleRGSUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&sensor=false";
//        var googleRGSUrl = "http://geocoder.tmatics.com/location/reverse?latitude="+latitude+"&longitude="+longitude;

    console.log("**********************geo code url**************************")
    console.log(googleRGSUrl)
    console.log("************************************************************")

    return new Promise(function (resolve, reject) {
        request({url: googleRGSUrl, json: true}, function (err, res, body) {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code: " + res.statusCode);
                err.res = res;
                return reject(err);
            }

            return self.apiService.processGoogleRGCData((body))
                .then(function (result) {
                    resolve(result)
                })
            //console.log("body", body);
            //resolve(body);
        });
    });


    //
    //req.on('response').then(function(response){
    //    var data = "";
    //
    //    return new Promise(function (resolve, reject) {
    //
    //        response.on("error", function (err) {
    //            reject(err)
    //        });
    //
    //        response.on("data", function (chunk) {
    //            data += chunk;
    //        });
    //        response.on("end", function ( argument ) {
    //
    //
    //            self.apiService.processGoogleRGCData(JSON.parse(data))
    //                .then(function (result) {
    //                    resolve(result)
    //                })
    //        })
    //
    //    })
    //})
};


/******************************************************************************************
 * Function to get Reverse Geo coder data using geonames service
 ******************************************************************************************/

APIAction.prototype.getAddressUsingGeonames = function (input) {
    var self = this;
    var latitude = input.latitude
    var longitude = input.longitude
    var latlng = latitude + "," + longitude;

    var geonamesRGSUrlParams = 'lat=' + latitude + '&lng=' + longitude;

    var geonamesRGSUrl = cg.geonamesRGSUrl + geonamesRGSUrlParams;

    var req = request.get(geonamesRGSUrl);
    req.end();
    req.on('response', function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            self.apiService.processGeonameRGCData(chunk, callback);
        });
    });
    req.on('error', function (e) {
        console.log("Stack" + e.stack);
        throw e;
    });
};

/******************************************************************************************
 * Function to get Reverse Geo coder data using where service
 ******************************************************************************************/

APIAction.prototype.getAddressUsingWhere = function (input) {
    var latitude = input.latitude
    var longitude = input.longitude
    var latlng = latitude + "," + longitude;
    try {
        var latLng = new where.Point(latitude, longitude);
        geocoder.fromPoint(latLng, function (err, location) {
            self.apiService.processWhereRGCData(location, callback);
        });
    } catch (e) {
        throw e;
    }
};