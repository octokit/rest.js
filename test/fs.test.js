var async = require("../lib/async")
var assert = require("assert")
var Path = require("path")
var fs = require("fs")

var testDir = __dirname + "/assets_TEST"

var Test = {
    
    setUp: function(next) {
        async.rmtree(__dirname + "/assets_TEST", function() {
            async.copytree(__dirname + "/assets", testDir, next)
        })
    },
    
    tearDown: function(next) {
        async.rmtree(__dirname + "/assets_TEST", next)
    },
    
    "test stat": function(next) {
        async.files([testDir + "/1.txt"])
            .stat()
            .end(function(err, file) {
                assert.ok(!err)
                assert.ok(file.stat.isFile())
                next()
            })
    },
    
    "test unlink existing file should remove the file": function(next) {
        async.files([testDir + "/3.txt"])
            .unlink()
            .end(function(err, file) {
                Path.exists(file.path, function(exists) {
                    assert.ok(!exists)
                    next()
                })
            })
    },

    "test rmdir empty dir should remove it": function(next) {
        async.files([testDir + "/emptydir"])
            .rmdir()
            .end(function(err, file) {
                Path.exists(file.path, function(exists) {
                    assert.ok(!exists)
                    next()
                })
            })        
    },
    
    "test rmdir non empty dir should fail": function(next) {
        async.files([testDir + "/nonemptydir"])
            .rmdir()
            .end(function(err, file) {
                assert.ok(err)
                Path.exists(file.path, function(exists) {
                    assert.ok(exists)
                    next()
                })
            })
    },
    
    "test rmdir non existing dir should fail": function(next) {
        async.files([testDir + "/foobar"])
            .rmdir()
            .end(function(err, file) {
                assert.ok(err)
                next()
            })
    },
    
    "test read file": function(next) {
        async.files([testDir + "/1.txt"])
            .readFile()
            .end(function(err, file) {
                assert.ok(!err)
                assert.equal(file.data, "1")
                next()
            })
    },
    
    "test open/close file": function(next) {
        async.files([testDir + "/1.txt"])
            .open()
            .each(function(file, next) {
                assert.ok(file.fd)
                next()
            })
            .close()
            .each(function(file, next) {
                assert.ok(!file.fd)
                next()
            })
            .end(function(err) {
                assert.ok(!err)
                next()                
            })
    },
    
    "test chmod": function(next) {
        async.files([testDir + "/1.txt"])
            .chmod(0600)
            .each(function(file, next) {
                fs.stat(file.path, function(err, stat) {
                    // TODO node.js error?
                    //assert.equal(stat.mode, 0600)
                    next()
                })
            })
            .stat()
            .chmod(0644)
            .each(function(file, next) {
                fs.stat(file.path, function(err, stat) {
                    // TODO node.js error?
                    //assert.equal(stat.mode, file.stat.mode)
                    next()
                })
            })
            .end(function(err) {
                assert.ok(!err)
                next()                
            })
    }


}

module.exports = require("../lib/async/test").testcase(Test)

if (module === require.main)
    module.exports.run().report().end()
