'use strict';
var mongoose = require('mongoose');

var TaxSchema = mongoose.Schema({
  year: String,
  totalPaid: String,
  software: String,
  date: Date,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Tax', TaxSchema);
