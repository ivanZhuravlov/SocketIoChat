var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = process.env.PORT || 8080;

// This will help getting info from requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Lets use routes since maybe this file will get too large (or maybe not)
//and in that case i'll be able to move the routes to another file
var routes = express.Router(); 

//TODO: disable this API
routes.get('/', function(req, res) {
    res.send('Server is up and running on ' + req.get('host') + '/');
});

/*
*   POST authenticate
*   Authenticates an user
*/ 
routes.post('/authenticate',function(req,res){
    res.send('You called POST authenticate');
});

/*
*   POST users
*   Creates a new user
*/ 
routes.post('/users',function(req,res){
    res.send('you called POST users');
});

/*
*   GET me
*   returns the current user according to credentials
*   Also the client can user this to check it's token before making requests
*/ 
routes.get('/me',function(req,res){
    res.send('you called me');
});

/*
*   GET users
*   returns all connected users
*/
routes.get('/users',function(req,res){
    res.send('you called GET users');
});

app.use('/',routes);
app.listen(port);