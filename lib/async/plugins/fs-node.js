/*!
 * async.js
 * Copyright(c) 2010 Fabian Jakobs <fabian.jakobs@web.de>
 * MIT Licensed
 */

var async = require("../async")
var fs = require("fs")

async.plugin({
    stat: function() {
        return this.$unaryOp(fs.stat, "stat")
    },

    lstat: function() {
        return this.$unaryOp(fs.lstat, "stat")
    },

    fstat: function() {
        return this.$unaryOp(fs.fstat, "stat")
    },
    
    unlink: function() {
        return this.$unaryOp(fs.unlink)
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
    
    $unaryOp: function(fn, storeKey) {
        return this.each(function(file, next) {
            if (!file.path)
                return next("not a file sequence!")
                
            fn(file.path, function(err, result) {
                if (err) 
                    return next(err)
                if (storeKey)
                    file[storeKey] = result
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
    files: function(files, root) {
        if (root)
            root += "/"
        else
            root = ""
        return async.list(files.map(function(name) { return {path: root + name}}))
    },
    
    readdir: function(path) {
        var filesGen
        
        return new async.Generator(function(callback) {
            if (filesGen)
                return filesGen.next(callback)
                
            fs.readdir(path, function(err, files) {
                if (err)
                    return callback(err)
                    
                filesGen = async.files(files, path)
                filesGen.next(callback)
            })
        })
    }
})