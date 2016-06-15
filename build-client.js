//REQUIRE NODE  MODULES
var bitbucket = require('bitbucket-rest');
var exec = require('child_process').exec, child;
var fileExists = require('file-exists');
require( "console-stamp" )( console, { metadata: function () {
    return ("[" + "SDK" + "]");
},
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    }} );

// REQUIRE SWAGGER JSON

var swaggerJson = require('./swagger.json');
var fs = require('fs');
var CodeGen = require('tswagger-codegen').CodeGen;
var file = __dirname+'/swagger.json';
var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
var Mustache = require('mustache');


var className = swaggerJson.className;
var repoName = swaggerJson.gitRepoName;
var repoTeamName = 'client_microservice';
var destFolder = null;
var clinetLibPath ='../'+repoName;


//CONNECT BITBUCKET


var client = bitbucket.connectClient({username : 'selvakumarm@teezle.com', password : 'selva123'});

client.getRepoDetails({owner:repoTeamName, repo_slug : repoName}, function(res){
    if(res){
        if(res.status === 200){

            cloneProject(null,function(err,data){
                var isPkgJsonExist = checkPkgJsonExist();
                if(isPkgJsonExist){
                    console.log("PACKAGE.JSON EXIST");
                    removeOldFile(null,function(err,data){
                        buildSdk(null,function(err,data){
                            fillJson(null,function(err,output){
                                generateNewSdk(output, function (err, res) {
                                    fillIndex(null,function(err,res) {
                                        setTimeout(function () {
                                            pushToGit(res, function (err, res) {
                                                console.error("FINISHED");
                                            })
                                        },4000)
                                    })

                                })
                            })
                        })

                    })
                }
                else {
                    console.error("PACKAGE.JSON IS NOT EXIST");
                    buildSdk(001,function(err,data){
                        fillJson(null,function(err,res){
                            if(!err) {
                                generateNewSdk(res, function (err, res) {
                                    fillIndex(null,function(err,res) {
                                        setTimeout(function () {
                                            pushToGit(res, function (err, res) {
                                                console.error("FINISHED");
                                            })
                                        }, 6000)
                                    })
                                })
                            }
                        })

                    })
                }

                /*removeOldFile(null,function(err,data){

                 generateNewSdk(null,function(err,data){

                 pushTogit(null,function(err,data){

                 })
                 })

                 })
                 */
            })

        }
        else if(res.status === 404){

            console.log('********************* REPO DOESNT EXIST ****************************')
            console.log("********************* PLEASE CREATE REPOSITORY IN BITBUCKET ( REPO NAME : "+ repoName +" ) ****************************")
        }
        else{
            console.log('********************* SOME PROBLEM IN RESPONSE ****************************')
        }
    }
    else{
        console.log('********************* CANNOT CONNECT TO BITBUCKET ISSUE IN GET REPO DETAILS ****************************')
    }
});


//git@bitbucket.org:dev_teezle/invista-demo.git

function cloneProject (input,cbk) {

    console.log("PROJECT EXIST");
    console.log("GOING TO CLONE : "+repoName);
    var shellCmd = 'cd .. && git clone git@bitbucket.org:'+repoTeamName+'/'+repoName;
    exec(shellCmd ,
        function (error, stdout, stderr) {
            console.log('CLONE RESULT: ' + stdout);

            if (stdout) {
                var   destPath = stdout
            }
            console.log('CLONE STD ERROR: ' + stderr);
            if (error !== null) {
                console.log('CLONE ERROR: ' + error);
            }
            cbk(null,null)
        });
}

function removeOldFile(input,cbk) {

    console.log("GOING TO REMOVE FILES");

    var shellCmd = "cd .. && cd "+repoName+" && find -maxdepth 1 -mindepth 1  -not -name .git  -exec rm -rf {} +";
    exec(shellCmd ,
        function (error, stdout, stderr) {
            console.log('REMOVE FILES OUT: ' + stdout);

            if (stdout) {
                var destPath = stdout
            }
            console.log('REMOVE FILES STD ERR: ' + stderr);
            if (error !== null) {
                console.error('REMOVE FILES ERROR: ' + error);
            }

            cbk(error,stdout)
        });


}

function generateNewSdk(input,cbk) {
    eval('var obj='+input);
    console.log(obj.author.rootFolder)
    destFolder = obj.author.rootFolder;
    var nodejsSourceCode = CodeGen.getNodeCode({
        className: className,
        swagger: swagger
    });
    var filepath = "../"+repoName+'/'+destFolder+'/'+className.toLowerCase()+".js";

    fs.writeFile(filepath, nodejsSourceCode, function(err) {
        if(!err){
        }
        else{
            console.log("FILE WRITTING ERROR")
        }

        cbk(null,null)
    });

}


function pushTogit(input,cbk) {

    var shellCmd = 'cd .. && cd '+repoName+' && git add --all && git status';
    exec(shellCmd ,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);

            if (stdout) {
                var destPath = stdout
            }
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            cbk(error,stdout)
        });
}

function checkPkgJsonExist(){
    return fileExists(clinetLibPath +'/package.json')
}



function buildSdk(input,cbk){
    if(input == 001)
    {
        console.log('SDK GOING TO BUILD FOR NEW REPOSITORY');
        var shellCmd = 'cd .. && cd '+repoName+'&& slush microservice-client-generator ';
    }
    else{
        console.log('SDK GOING TO BUILD FOR OLD REPOSITORY');
        var shellCmd = 'cd .. && cd '+repoName+'&& slush microservice-client-generator ';
    }

    exec(shellCmd ,
        function (error, stdout, stderr) {
            console.log('SDK RESULT : ',stdout);
            console.log('SDK ERROR : ',error);
            console.log('SDK STD ERROR : ',stderr);
            cbk(error,stdout)

        });
}


function fillJson(input,cbk){
    var generatedPackageJson = require('./package.json');

    var view = {
        name: repoName ? repoName : "Sorry",
        version: generatedPackageJson.version ? generatedPackageJson.version  : "",
        desc : generatedPackageJson.description ? generatedPackageJson.description : "",
        authorName : generatedPackageJson.author.name ? generatedPackageJson.author.name : "",
        authorEmail : generatedPackageJson.author.email ? generatedPackageJson.author.email : ""


    };

    //var test = require("../"+repoName+"/mustache-template.json");

    var pkgTemplatePath = "../"+repoName+"/package-temp.mustache";
    var generatedFile = fs.readFileSync(pkgTemplatePath, 'utf-8');

    var output = Mustache.render(generatedFile, view ,generatedFile);

    var filepath = "../"+repoName+"/package.json";

    fs.truncate(filepath, 0, function(){
        console.log('JSON removed')

        fs.writeFile(filepath, output, function(err) {
            if(!err){
            }
            else{
                console.log("FILE WRITTING ERROR")
            }

            var shellCmd = "cd .. && cd "+repoName+" && rm -f package-temp.mustache ";
            exec(shellCmd ,
                function (error, stdout, stderr) {
                    console.log('REMOVE FILES OUT: ' + stdout);

                    if (stdout) {
                        var destPath = stdout
                    }
                    console.log('REMOVE FILES STD ERR: ' + stderr);
                    if (error !== null) {
                        console.error('REMOVE FILES ERROR: ' + error);
                    }
                });

            cbk(null,output)
        });
    });






}


function fillIndex(input,cbk){

    var pkgTemplatePath = "../"+repoName+"/index-template.mustache";
    var generatedFile = fs.readFileSync(pkgTemplatePath, 'utf-8');
    var view = {
        className : className.toLowerCase()+".js"
    };

    var output = Mustache.render(generatedFile, view ,generatedFile);
    var filepath = "../"+repoName+"/"+destFolder+"/index.js";
    console.log(filepath);
    fs.truncate(filepath, 0, function(){
        console.log('JSON removed')

        fs.writeFile(filepath, output, function(err) {
            if(!err){
            }
            else{
                console.log(err);
                console.log("FILE WRITTING ERROR")
            }


            var shellCmd = "cd .. && cd "+repoName+" && rm -f index-template.mustache";
            exec(shellCmd ,
                function (error, stdout, stderr) {
                    console.log('REMOVE FILES OUT: ' + stdout);

                    if (stdout) {
                        var destPath = stdout
                    }
                    console.log('REMOVE FILES STD ERR: ' + stderr);
                    if (error !== null) {
                        console.error('REMOVE FILES ERROR: ' + error);
                    }
                });

            cbk(null,output);
        });

    });

}


function pushToGit(input,cbk){

    var shellCmd = 'cd .. && cd '+repoName+'&& git add --all && git commit -m selva  && git push origin master';
//    var shellCmd = 'cd .. && cd '+repoName+'&& git status';

    exec(shellCmd ,
        function (error, stdout, stderr) {
            console.log('PUSH SUCESS : ',stdout);
            console.log('ERROR IN PUSH : ',error);
            console.log('ERROR ERROR : ',stderr);
            cbk(error,stdout)

        });
}