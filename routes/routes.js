/***********************************************************************************
 *MODULES REQUIREMENT START HERE BY RT-TEAM
 **********************************************************************************/

var ApiRoutes = function (app) {

    this.app = app;
    this.conf = app.conf;
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

};



