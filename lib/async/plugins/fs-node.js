/*!
 * async.js
 * Copyright(c) 2010 Fabian Jakobs <fabian.jakobs@web.de>
 * MIT Licensed
 */

var async = require("../async")
var fs = require("fs")

async.plugin({
    stat: function() {
        return this.$stat(fs.stat)
    },

    lstat: function() {
        return this.$stat(fs.lstat)
    },

    fstat: function() {
        return this.$stat(fs.fstat)
    },
    
    $stat: function(statFn) {
        return this.each(function(file, next) {
            if (!file.path)
                return next("not a file sequence!")
                
            statFn(file.path, function(err, stat) {
                if (err) 
                    return next(err)
                file.stat = stat;
                next();
            })
        })        
    },
    
    readFile : function() {
        return this.each(function(file, next) {
            if (!file.path)
                return next("not a file sequence!")
                
            fs.readFile(file.path, function(err, data) {
                if (err) 
                    return next(err)
                file.data = data;
                next();
            })            
        })
    }
}, {
    readdir: function(path) {
        var filesGen
        
        return new async.Generator(function(callback) {
            if (filesGen)
                return filesGen.next(callback)
                
            fs.readdir(path, function(err, files) {
                if (err)
                    return callback(err)
                    
                filesGen = new async.list(files.map(function(name) { 
                    return {
                        name: name,
                        path: path + "/" + name
                    }
                }))
                filesGen.next(callback)
            })
        })
    }
})