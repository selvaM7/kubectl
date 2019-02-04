/***********************************************************************************
 *MODULES REQUIREMENT START HERE BY RT-TEAM
 **********************************************************************************/

var APIAction = require('../actions/api-actions.js');

var Promise = require('bluebird');


var ApiRoutes = function (app) {

    this.app = app;
    this.conf = app.conf;
    this.apiActionInstance = new APIAction(app);
    this.apiAction = Promise.promisifyAll(this.apiActionInstance);
};
module.exports = ApiRoutes;

/***********************************************************************************
 *PROTOTYPES START HERE BY RT-TEAM
 **********************************************************************************/

ApiRoutes.prototype.init = function () {

    var self = this;
    var app = self.app;


    /**************************************************************************************
     *         SAMPLE ENDPOINT
     * ************************************************************************************/
    app.server.route({
        method: 'GET',
        path:'/',
        handler: function (request, reply) {
                return reply({'test':'Ok'});
        }
    });



    app.server.route({
        method: 'GET',
        path:'/v1/getLocationDetails',
        handler: function (request, reply) {

            self.apiAction.getStaticAddress(request)
                .then(function(result){
                    console.log("*********RESPONSE FROM GEOCODER *********",result)
                    reply(result)
                })

                .error(function(e){
                    console.log("ERROR HANDLER " + e);
                    reply(e)
                })
                .catch(function(e){
                    console.log("CATCH in " + e);
                    reply(e)
                })

        }
    });

};



