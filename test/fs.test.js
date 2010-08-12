var async = require("../lib/async")
var assert = require("assert")
var Path = require("path")

var testDir = __dirname + "/assets_TEST"

var Test = {
    
    setUp: function(next) {
        async.copytree(__dirname + "/assets", testDir, next)
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
    }

}

module.exports = require("../lib/async/test").testcase(Test)

if (module === require.main)
    module.exports.run().report().end()
