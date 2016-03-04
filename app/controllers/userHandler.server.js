"use strict";

var Users = require("../models/users.js");
var Books = require("../models/books.js");

var mongoose = require('mongoose');

function UserHandler(){
    
    this.addBook = function(req,res){
        var newId = mongoose.Types.ObjectId();
        var newBook = new Books({
            _id: newId,
            title: req.body.title,
            description: req.body.desc
        });
        Users.findOneAndUpdate({'google.id': req.user.google.id},{$push: {books: newId}})
            .exec(function(err, user) {
                if(err) throw err;
                newBook._owner = user._id;
                newBook.save(function(err2,book){
                    if(err2) throw err2;
                    res.redirect('/library');
                });
            });
    };
    
    this.populateLibrary = function(req,res){
        Users.findOne({'google.id':req.user.google.id})
            .populate('books')
            .exec(function(err,user){
                if(err) throw err;
                res.render('library',{name: user.name, books: user.books});
            });
    };
    
    this.getBook = function(req,res){
        Books.findOne({_id:req.params.id})
            .populate('_owner')
            .exec(function(err,data){
                if(err) throw err;
                var city = data._owner.city;
                var state = data._owner.state;
                var location = "No location data provided";
                if(city !== "" && state != ""){
                    location = city + ", " + state;
                }else if(city !== ""){
                    location = city;
                }else if(state !== ""){
                    location = state;
                }
                res.render('book',{book: data, location: location});
            });
    };
    
    this.displayProfile = function(req, res){
        Users.findOne({'google.id':req.user.google.id})
            .exec(function(err, data) {
                if (err) throw err;
                res.render('profile',{
                    name: data.name,
                    city: data.city,
                    state: data.state
                });
            });
    };
    
    this.updateProfile = function(req, res){
        Users.findOneAndUpdate({'google.id':req.user.google.id},
            {$set: {
                name: req.body.name,
                city: req.body.city,
                state: req.body.state
            }},
            {new:true})
            .exec(function(err, data) {
                if(err) throw err;
                res.render('profile',{
                    name: data.name,
                    city: data.city,
                    state: data.state
                });
            });
    };
    
    this.search = function(req,res){
        Books.aggregate([
            {$match: {$text: {$search: req.query.query}}},
            {$project: {title: 1, description: 1}}
        ])
        .exec(function(err,data){
            if(err) throw err;
            res.render('search', {results: data});
        });
    };
    
    // this.watchStock = function(req,res){
    //     var myStock = {symbol:req.params.symbol,name:req.params.name};
    //     Users.findOneAndUpdate({'google.id': req.user.google.id},{$addToSet: {stocks: myStock}})
    //         .exec(function(err,data){
    //             if(err) throw err;
                
    //             res.json(data);
    //         });
    // };
    
    // this.getStocks = function(req,res){
    //     Users.findOne({'google.id':req.user.google.id},{_id:0})
    //         .exec(function(err, data) {
    //             if(err) throw err;
                
    //             var fullName = req.user.google.displayName;
    //             var firstName = fullName.substring(0,fullName.lastIndexOf(' '));
                
    //             res.render('profile', {name: firstName, stocks: data.stocks});
    //         });
    // };
    
    // this.unwatchStock = function(req,res){
    //     Users.findOneAndUpdate(
    //         {'google.id':req.user.google.id},
    //         {$pull: {stocks: {symbol:req.params.symbol}}})
    //         .exec(function(err, data) {
    //             if(err) throw err;
                
    //             res.json(data);
    //         });
    // };
    
    // this.getWatchers = function(req,res){
    //     Users.find({'stocks.symbol':req.params.symbol})
    //         .exec(function(err,data){
    //             if(err) return res.json(err);
    //             var users = data.map(function(doc){
    //                 return doc.google.displayName;
    //             });
    //             return res.json(users);
    //         });
    // };
    
    // this.isWatching = function(req,res){
    //     Users.find({'google.id':req.user.google.id,'stocks.symbol':req.params.symbol})
    //         .exec(function(err, data) {
    //             if(err) res.json({found:false});
    //             if(data.length>0){
    //                 res.json({found:true});
    //             }else{
    //                 res.json({found:false});
    //             }
    //         });
    // };
}

module.exports = UserHandler;