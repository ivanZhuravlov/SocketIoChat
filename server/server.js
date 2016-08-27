var express     = require('express');
var app         = express();
var bodyParser  = require("body-parser");
var config      = require('./config');
var mongoose    = require('mongoose');
var crypto      = require('crypto');
var morgan      = require('morgan');

var port = config.port || 8080;
mongoose.connect(config.database);

/*
*   Mongoose Models
*/
var User   = require('./app/models/user'); 

// This will help getting info from requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Logging
app.use(morgan('dev'));

//Lets use routes since maybe this file will get too large (or maybe not)
//and in that case i'll be able to move the routes to another file
var routes = express.Router(); 

//TODO: disable this API
routes.get('/', function(req, res) {
    res.send('Server is up and running on ' + req.get('host') + '/');
});

/*
*   POST authenticate
*   Statuses: 404 Bad request | 200 Ok | 400 Not found | 500 Internal Server Error
*   Authenticates an user
*/ 
routes.post('/authenticate',function(req,res){

    var name = req.body.name;
    var password = req.body.password;
    
    if(!name || !password){
        res.status(404).json({ success: false, message: 'Missing user name or password.' });
    }

    User.findOne({ name : name }, function(err, user) {
        if(err){
            res.status(500).json({ success: false, message : 'Unexpected DB Error' });
            return;
        }

        if(user){
            //User exists
            //TODO: use salt as well if salt is implemented
            var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            if(user.password == hashedPassword){
                res.status(200).json({ success: true });
                //More on this later, token auth will be implemented
            } else {
                res.status(400).json({ success: false, message : 'Incorrect password' });
            }
        } else {
            //User doesn't exists
            res.status(404).json({ success: false, message : 'User name not found' });
        }
    });
});

/*
*   POST users
*   Statuses: 404 Bad request | 201 Created | 409 Conflict | 500 Internal Server Error
*   Creates a new user
*/ 
routes.post('/users',function(req,res){

    var name = req.body.name;
    var password = req.body.password;

    if(!name || !password){
        res.status(404).json({ success: false, message: 'Missing user name or password.' });
        return;
    }

    User.findOne({ name : name }, function(err, user) {
        if(err){
            res.status(500).json({ success: false, message : 'Unexpected DB Error' });
            return;
        }

        if(!user){
            //User name is available
            var hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); //TODO: add salt
            var newUser = new User({
                name        : req.body.name,
                password    : hashedPassword,
            });
            newUser.save(function(err) {
                if (err){
                    throw err;
                }
                res.status(201).json({ success: true });
            });
        } else {
            //User name is not available, already registered
            res.status(409).json({ success: false, message: 'User name not available.' });
        }
    });
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