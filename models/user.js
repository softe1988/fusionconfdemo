let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now} 
});

module.exports = mongoose.model('User', UserSchema);


