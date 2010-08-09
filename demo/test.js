
var suite = {
    setUp: function(next) {
        
    },
    
    testSyncOK: function() {
        assert.ok(true);
    },
    
    testAsyncOK: function(next) {
        setTimeout(function() {
            assert.ok(true);
            next();
        }, 0)
    }
}

var atest = require("../lib/atest")
atest.suite(suite).run(function() {
    console.log("DONE")
})