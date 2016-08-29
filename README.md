# nodechat
Node.js chat implementation

# Requirements
* node (i'm using v6.4.0)
* mongodb (i'm using 3.2.9)

# Server Start
> * $ mongod 
> * > use chat
> * $ npm install
* Above commands just the first time
> * $ node server.js

# Client Start
> * $ npm install
> * Above command just the first time
> * $ npm start

#Api Spec

##POST /users 
* Sign up user

##POST /authenticate
* Authenticate an user

##GET /me
* Get Current User

##GET /users 
* List Of Connected Users

