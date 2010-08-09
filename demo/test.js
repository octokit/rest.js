/*!
 * async.js
 * Copyright(c) 2010 Fabian Jakobs <fabian.jakobs@web.de>
 * MIT Licensed
 */

var assert = require("assert")

var suite = {
    setUp: function() {
        next()
    },
    
    tearDown: function() {
    },
    
    testSyncOK: function() {
        assert.ok(true);
    },
    
    testAsyncOK: function(next) {
        setTimeout(function() {
            assert.ok(true);
            next();
        }, 0)
    },
    
    testSyncFail: function() {
        assert.ok(false)
    },
    
    testAsyncFail: function(next) {
        setTimeout(function() {
            assert.ok(false);
            next();
        }, 0)
    },
}

var atest = require("../lib/atest")
atest.suite(suite).run().report().end();

// filter