var express     = require('express');
var app         = express();
var bodyParser  = require("body-parser");
var config      = require('./config');
var mongoose    = require('mongoose');
var crypto      = require('crypto');
var morgan      = require('morgan');
var jwt         = require('jsonwebtoken');
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var cors        = require('cors');

/*
*   Config Stuff
*/
var port = config.port || 8080;
mongoose.connect(config.database);

/*
*   Mongoose Models
*/
var User   = require('./app/models/user'); 

// This will help getting info from requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Responses Logging
app.use(morgan('dev'));

//Adding cors for all routes since angular needs it
app.use(cors());

//json web token secret
app.set('jwtsecret', config.jwtsecret);

//Lets use routes since maybe this file will get too large (or maybe not)
//and in that case i'll be able to move the routes to another file
var routes = express.Router(); 

/*
*   Status Api to check if server is running
*/
routes.get('/status', function(req, res) {
    res.status(200).send('Server is up and running on ' + req.get('host') + '/');
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
        return res.status(404).json({ success: false, message: 'Missing user name or password.' });
    }

    User.findOne({ name : name }, function(err, user) {
        if(err){
            return res.status(500).json({ success: false, message : 'Unexpected DB Error' });
        }

        if(user){
            //User exists
            //TODO: use salt as well if salt is implemented
            var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            if(user.password == hashedPassword){
                var jwtoken = jwt.sign({ name : name }, app.get('jwtsecret'), {
                    expiresIn : "1440m"
                });
                res.status(200).json({ success: true , token : jwtoken });
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
        return res.status(404).json({ success: false, message: 'Missing user name or password.' });
    }

    User.findOne({ name : name }, function(err, user) {
        if(err){
            return res.status(500).json({ success: false, message : 'Unexpected DB Error' });
        }

        if(!user){
            //User name is available
            var hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); //TODO: add salt
            var newUser = new User({
                name        : name,
                password    : hashedPassword,
            });
            newUser.save(function(err) {
                if(err) {
                    throw err;
                }
                var jwtoken = jwt.sign({ name : name }, app.get('jwtsecret'), {
                    expiresIn : "1440m"
                });
                res.status(201).json({ success: true , token : jwtoken });
            });
        } else {
            //User name is not available, already registered
            res.status(409).json({ success: false, message: 'User name not available.' });
        }
    });
});

/*
*   Token Filter
*   Check if user sent a valid token on the request to so access to below routes
*   Route order matters so above routes won't require token
*/
routes.use(function(req, res, next) {
    var token = req.headers['x-access-token'];
  
    if(token) {
        jwt.verify(token, app.get('jwtsecret'), function(err, decoded) {      
            if(err){
                return res.status(401).json({ success: false, message: 'Failed to validate token or token in expired' });    
            } else { 
                req.decoded = decoded;   
                next();
            }
        });
    } else {
        return res.status(401).json({ success: false, message: 'Failed to validate token or token in expired' });
    }
});

/*
*   GET me
*   Statuses: 200 Ok
*   returns the current user according to credentials
*   Also the client can user this to check it's token before making requests
*/ 
routes.get('/me',function(req,res){
    res.status(200).json({ sucess: true , user : { name : req.decoded.name } } );
});

/*
*   GET users
*   returns all connected users
*/
routes.get('/users',function(req,res){
    res.send('you called GET users');
});

app.use('/',routes);
http.listen(port);

io.sockets.on('connection',function(socket){
    
    io.emit('userConnected','');

    socket.on('globalMessage', function(data){
        var forwardData = { message : data.message , id : data.id };
        io.emit('globalMessage', forwardData);
    });
});