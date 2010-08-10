
var async = require("../lib/async")
var fs = require("fs")
var path = require("path")

function postOrder(next) {
    console.log("")
    console.log("post order walker:")
    async.walkfiles(__dirname)
        .each(function(file) {
            console.log(file.path)
        })
        .end(next)
}

function inOrder(next) {
    console.log("")
    console.log("in order walker:")
    async.walkfiles(__dirname, null, true)
        .each(function(file) {
            console.log(file.path)
        })
        .end(next)
}

function filerAssets(next) {
    console.log("")
    console.log("filter assets directory")
    var filter = function(file) {
        return file.name !== "assets" || !file.stat.isDirectory()
    }
    async.walkfiles(__dirname, filter, true)
        .each(function(file) {
            console.log(file.path)
        })
        .end(next)
}

// TODO use read and write to make copy streaming
// TODO set the mode of the new file
function copyfile(srcPath, destPath, callback) {
    fs.stat(destPath, function(err, stat) {
        if (stat && stat.isDirectory())
            destPath = path.join(destPath, path.basename(srcPath))
        copy()
    })
    
    function copy() {
        fs.readFile(srcPath, function(err, data) {
            if (err)
                return callback(err)
            
            fs.writeFile(destPath, data, callback)
        })
    }
}

abspath = function(dir) {
    dir = path.normalize(dir)
    if (dir.charAt(0) == "/")
        return dir
    else
        return path.normalize(path.join(process.cwd(), dir))
}

function copydir(srcPath, destPath, callback) {
    srcPath = abspath(srcPath)
    destPath = abspath(destPath)

    if (destPath.indexOf(srcPath) == 0 && destPath.charAt(srcPath.length) == "/")
        return callback("the destination path is inside of the source path")
    
    path.exists(destPath, function(exists) {
        if (!exists)
            fs.mkdir(destPath, 0755, walk)
        else
            walk()
    })
    
    function walk(err) {
        if (err)
            return callback(err)
            
        async.walkfiles(srcPath, null, true)
            .stat()
            .each(function(file, next) {
                var relative = file.path.substring(srcPath.length)
                if (!relative)
                    return next();
                
                var dest = path.join(destPath, relative)
                if (file.stat.isDirectory())
                    fs.mkdir(dest, file.stat.mode, next)
                else
                    copyfile(file.path, dest, next)
            })
            .end(callback)
    }
}


function copy(next) {
    copydir(__dirname, __dirname + "/../COPY", function(err) {
        console.log("DONE " + err)
    })
}

//copy(function() {})
async.list([postOrder, inOrder, filerAssets]).call().end()