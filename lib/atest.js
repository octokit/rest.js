var sys = require("sys")
var async = require("./async")

exports.TestGenerator = function(source) {
    async.Generator.call(this, source)
}

sys.inherits(exports.TestGenerator, async.Generator);

(function() {
    
    this.run = function() {
        this.source
    }
    
}).call(exports.TestGenerator.prototype);

exports.suite = function(suite) {
    
    var methods = Object.keys(suite)
    var setUp = suite.setUp || null
    var tearDown = suite.tearDown || null
    var tests = methods.filter(function(method) {method.indexOf("test") == 0 })
    
    return async.list(tests, exports.TestGenerator).map(function(name) {
        return {
            name: name,
            setUp: setUp,
            tearDown: tearDown,
            context: suite,
            fn: suite[name]
        }
    })
}