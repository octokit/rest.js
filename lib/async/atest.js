/*!
 * async.js
 * Copyright(c) 2010 Fabian Jakobs <fabian.jakobs@web.de>
 * MIT Licensed
 */

var sys = require("sys")
var async = require("./async")

exports.TestGenerator = function(source) {
    async.Generator.call(this, source)
}

sys.inherits(exports.TestGenerator, async.Generator);

(function() {
    
    this.run = function() {
        return this.setupTest().each(function(test, next) {            
            test.test(function(err, passed) {
                test.err = err
                test.passed = passed
                next()
            })
        })
    }
    
    this.report = function() {
        return this.each(function(test, next) {
            console.log(test.name + " " + test.passed)
            if (!test.passed)
                console.log(test.err.stack)

            next()
        })
    }
    
    this.setupTest = function() {
        return this.each(function(test, next) {
            var empty = function(next) { next() };
            var context = test.context || this;
            
            if (test.setUp)
                var setUp = async.makeAsync(0, test.setUp, context)
            else 
                setUp = empty

            if (test.tearDown)
                var tearDown = async.makeAsync(0, test.tearDown, context)
            else
                tearDown = empty

            var testFn = async.makeAsync(0, test.fn, context)
                
            test.test = function(callback) {                
                function errorListener(e) {
                    process.removeListener('uncaughtException', errorListener)
                    callback(e, false)
                }
                process.addListener('uncaughtException', errorListener)
                
                setUp.call(context, function() {
                    testFn.call(context, function(err) {
                        tearDown.call(context, function() {
                            process.removeListener('uncaughtException', errorListener)
                            callback(err, !err)
                        })
                    })
                })
            }
            
            next()
        })
    }
    
}).call(exports.TestGenerator.prototype);

exports.suite = function(suite) {
    var methods = Object.keys(suite)
    var setUp = suite.setUp || null
    var tearDown = suite.tearDown || null
    var tests = methods
        .filter(function(method) { return method.indexOf("test") == 0 })
        .map(function(name) {
            return {
                name: name,
                setUp: setUp,
                tearDown: tearDown,
                context: suite,
                fn: suite[name]
            }
        })
        
    return async.list(tests, exports.TestGenerator);
}