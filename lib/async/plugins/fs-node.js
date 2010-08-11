/*!
 * async.js
 * Copyright(c) 2010 Fabian Jakobs <fabian.jakobs@web.de>
 * MIT Licensed
 */

var async = require("../async")
var fs = require("fs")

var POSTORDER = 0
var PREORDER = 1

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

    rmdir: function() {
        return this.$unaryOp(fs.rmdir)
    },

    close: function() {
        return this.$unaryOp(fs.close)
    },

    $stat: function(statFn) {
        return this.each(function(file, next) {
            if (!file.path)
                return next("not a file sequence!")
                
            statFn(file.path, function(err, stat) {
                if (err) 
                    return next(err)
                file.stat = stat
                next()
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
                next()
            })
        })        
    },
    
    readFile : function(encoding) {
        return this.each(function(file, next) {
            if (!file.path)
                return next("not a file sequence!")
            
            if (encoding)
                fs.readFile(file.path, encoding, readCallback)
            else
                fs.readFile(file.path, readCallback)
            
            function readCallback(err, data) {
                if (err) 
                    return next(err)
                file.data = data
                next()
            }            
        })
    }
}, {
    files: function(files, root) {
        if (root)
            root += "/"
        else
            root = ""
        return async.list(files.map(function(name) {
            return {
                path: root + name,
                name: name
            }
        }))
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
    },
    
    POSTORDER: POSTORDER,
    PREORDER: PREORDER,
    
    walkfiles: function(path, recurse, order) {
        recurse = recurse || function(item, next) { next(null, true) }

        var gen
        var next = function(callback) {
            if (gen)
                return gen.next(callback)

            var files = []
            var dirs = []

            async.readdir(path)
                .stat()
                .filter(recurse)
                .each(function(file) {
                    if (file.stat.isDirectory())
                        dirs.push(file.path)
                    else 
                        files.push(file.path)
                }).end(function(err) {
                    if (err)
                        return callback(err)
                    async.list(dirs)                        
                        .map(function(dir) {
                            return async.walkfiles(dir, recurse, order)
                        })                    
                        .toArray(function(err, gens) {
                            if (err)
                                return callback(err)

                            if (order == PREORDER)
                                gens.unshift(async.files([path]))                           
                            else
                                files.push(path)
                                
                            gens.push(async.files(files))
                            gen = async.concat.apply(async, gens)

                            gen.next(callback)
                        })
                })
        }
        return new async.Generator(next)    
    }
    
})