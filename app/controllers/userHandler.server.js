"use strict";

var Users = require("../models/users.js");

function UserHandler(){
    
    this.addBook = function(req,res){
        var newBook = {
            title: req.body.title,
            description: req.body.desc
        }
        Users.findOneAndUpdate({'google.id': req.user.google.id},{$addToSet: {books: newBook}})
            .exec(function(err,data){
                if(err) throw err;
                res.redirect('/library');
            });
    };
    
    this.populateLibrary = function(req,res){
        Users.findOne({'google.id':req.user.google.id})
            .exec(function(err,data){
                res.render('library',{name: data.name, books: data.books});
            });
    };
    
    this.getBook = function(req,res){
        Users.findOne({'books._id':req.params.id})
            .exec(function(err,data){
                var location = "No location data provided";
                if(data.city && data.state){
                    location = data.city + ", " + data.state;
                }else if(data.city){
                    location = data.city;
                }else if(data.state){
                    location = data.state;
                }
                for(var i in data.books){
                    if(data.books[i].id === req.params.id){
                        res.render('book',{book: data.books[i], location: location});
                    }
                }
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