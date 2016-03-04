'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
    title: String,
    description: String,
    requestedBy: String,
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

Book.index({title: "text", description: "text"});

module.exports = mongoose.model('Book', Book);