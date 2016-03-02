'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    google:{
        id: String,
        displayName: String,
        email: String,
        token: String
    }
    name: String,
    city: String,
    state: String,
    books:{
        name: String,
        description: String
    }
});

module.exports = mongoose.model('User', User);