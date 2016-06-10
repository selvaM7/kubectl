/************************************************************************
 * Required Modules
 * **********************************************************************/

var Promise = require('bluebird');

/************************************************************************
 * Class Declaration
 * **********************************************************************/
var APIService = function (app) {
    this.app = app;
    this.conf = app.conf;
    this.db = app.mongoDb;
};

module.exports = APIService;

/***********************************************************************
 * FUNCTION DECLARATION
 * **********************************************************************/


//Google

APIService.prototype.processGoogleRGCData = function (input) {


    var requestObj = input;

    var address = {};
    return new Promise(function (resolve, reject) {

        var addressComponentsList = 0;
        if (requestObj.results != null) {
            var addressComponentsList = requestObj.results[0] ? requestObj.results[0].address_components : 0;
        }
        address.status = true;
        for (var i = 0; i < addressComponentsList.length; i++) {
            //		console.log(addressComponentsList[i]);
            switch (addressComponentsList[i].types[0]) {

                case "street_number":
                    address.streetNumber = addressComponentsList[i].long_name;
                    break;
                case "route":
                    address.street = addressComponentsList[i].long_name;
                    break;
                case "neighborhood":
                    address.area = addressComponentsList[i].long_name;
                    address.locality = addressComponentsList[i].long_name;
                    break;
                case "sublocality":
                    address.subLocality = addressComponentsList[i].long_name;
                    break;
                case "locality":
                    address.city = addressComponentsList[i].long_name;
                    address.cityShortName = addressComponentsList[i].short_name;
                    break;
                case "administrative_area_level_2":
                    //				rgcAddressDataModelInstance.city = addressComponentsList[i].long_name;
                    //				rgcAddressDataModelInstance.cityShortName = addressComponentsList[i].short_name;
                    break;
                case "administrative_area_level_1":
                    address.state = addressComponentsList[i].long_name;
                    address.stateShortName = addressComponentsList[i].long_name;
                    break;
                case "country":
                    address.country = addressComponentsList[i].long_name;
                    break;
                case "postal_code":
                    address.postalCode = addressComponentsList[i].long_name;
                    break;
            }
        }
        resolve(address) ;
    })
};


//Other Services

APIService.prototype.processGeonameRGCData = function (input) {
    //	dao.StoreRawRGCData(response, serviceName, 'printSuccess');
    var requestObject = JSON.parse(requestObj);

    var address = {status: false};
    if (requestObject.address) {
        address.status = true;
        address.streetNumber = requestObject.address.streetNumber ? requestObject.address.streetNumber : "";
        address.street = requestObject.address.street ? requestObject.address.street : "";
        address.city = requestObject.address.placename ? requestObject.address.placename : "";
        address.cityShortName = requestObject.address.placename ? requestObject.address.placename : "";
        address.city = requestObject.address.adminName2 ? requestObject.address.adminName2 : "";
        address.cityShortName = requestObject.address.adminName2 ? requestObject.address.adminName2 : "";
        address.state = requestObject.address.adminName1 ? requestObject.address.adminName1 : "";
        address.stateShortName = requestObject.address.adminCode1 ? requestObject.address.adminCode1 : "";
        address.country = requestObject.address.countryCode ? requestObject.address.countryCode : "";
        address.countryCode = requestObject.address.countryCode ? requestObject.address.countryCode : "";
        address.postalCode = requestObject.address.postalcode ? requestObject.address.postalcode : "";
//		if(requestObject.address.streetNumber)
//			address.streetNumber = requestObject.address.streetNumber;
//		if(requestObject.address.street)
//			address.street = requestObject.address.street;
//
//		if(requestObject.address.placename){
//			address.city = requestObject.address.placename;
//			address.cityShortName = requestObject.address.placename;
//		} else {
//			address.city = requestObject.address.adminName2;
//			address.cityShortName = requestObject.address.adminName2;
//		}
//		if(requestObject.address.adminName1)
//			address.state = requestObject.address.adminName1;
//		if(requestObject.address.adminCode1)
//			address.stateShortName = requestObject.address.adminCode1;
//		if(requestObject.address.countryCode){
//			address.country = requestObject.address.countryCode;
//			address.countryCode = requestObject.address.countryCode;
//		}
//		if(requestObject.address.postalcode)
//			address.postalCode = requestObject.address.postalcode;
    }
    callback(address);

};

//Where Services

APIService.prototype.processWhereRGCData = function (input) {
    //	dao.StoreRawRGCData(response, serviceName, 'printSuccess');
    var requestObject = response;

    var address = {};
    address.streetNumber = requestObject.address.streetNumber ? requestObject.address.streetNumber : "";
    address.street = requestObject.address.road ? requestObject.address.road : "";
    address.city = requestObject.address.city ? requestObject.address.city : "";
    address.cityShortName = requestObject.address.city ? requestObject.address.city : "";
    address.state = requestObject.address.state ? requestObject.address.state : "";
    address.stateShortName = requestObject.address.state ? requestObject.address.state : "";
    address.country = requestObject.address.country ? requestObject.address.country : "";
    address.postalCode = requestObject.address.postcode ? requestObject.address.postcode : "";
    address.countryCode = requestObject.address.country_code ? requestObject.address.country_code : "";

    callback(address);
};
