var mongoose = require('mongoose');
var autoIncrement = require('mongoose-sequence');

var UserSchema = mongoose.Schema({
    name : String,
    password : String
});

UserSchema.plugin(autoIncrement, {inc_field: 'id'});
module.exports = mongoose.model('User', UserSchema);