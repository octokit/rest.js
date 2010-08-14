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

sys.inherits(exports.TestGenerator, async.Generator)

;(function() {
    
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
            console.log(test.name + " " + (test.passed ? "OK" : "FAIL"))
            if (!test.passed)                
                if (test.err.stack)
                    console.log(test.err.stack)
                else
                    console.log(test.err)
                    
            next()
        })
    }
    
    this.setupTest = function() {
        return this.each(function(test, next) {
            var empty = function(next) { next() }
            var context = test.context || this
            
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
                var called            
                function errorListener(e) {
                    if (called)
                        return
                    called = true
                    process.removeListener('uncaughtException', errorListener)
                    callback(e, false)
                }
                process.addListener('uncaughtException', errorListener)
                
                // TODO make sure tearDown is always called
                async.list([setUp, testFn, tearDown])
                    .call(context)
                    .timeout(3000)
                    .toArray(false, function(errors, values) {
                        if (called)
                            return
                        called = true
                        var err = errors[1]
                        process.removeListener('uncaughtException', errorListener)                            
                        callback(err, !err)                        
                    })
            }
            
            next()
        })
    }
    
}).call(exports.TestGenerator.prototype)

exports.testcase = function(testcase) {
    var methods = Object.keys(testcase)
    var setUp = testcase.setUp || null
    var tearDown = testcase.tearDown || null
    var tests = methods
        .filter(function(method) { return method.indexOf("test") == 0 })
        .map(function(name) {
            return {
                name: name,
                setUp: setUp,
                tearDown: tearDown,
                context: testcase,
                fn: testcase[name]
            }
        })
        
    return async.list(tests, exports.TestGenerator)
}