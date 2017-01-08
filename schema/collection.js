//put master schema here when we complete it

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema =  new Schema({
  firstName: String,
  lastName: String,
  email: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now} 
});

module.exports = UserSchema;