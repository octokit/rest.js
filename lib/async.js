
var STOP = exports.STOP = {};

exports.Generator = function(source) {
    if (typeof source == "function")
        this.source = {
            next: source
        }
    else
        this.source = source
};

(function() {
    this.next = function(callback) {
        this.source.next(callback)
    }

    this.map = function(map) {
        map = makeAsync(1, map)
        
        var source = this.source;
        this.next = function(callback) {
            source.next(function(err, value) {
                if (err)
                    callback(err)
                else {
                    map(value, function(err, value) {
                        if (err)
                            callback(err)
                        else
                            callback(null, value)
                    })
                }
            })
        }
        return new this.constructor(this);
    }
    
    this.filter = function(filter) {
        filter = makeAsync(1, filter)
        
        var source = this.source
        this.next = function(callback) {
            source.next(function handler(err, value) {
                if (err)
                    callback(err)
                else {
                    filter(value, function(err, takeIt) {
                        if (err)
                            callback(err)
                        else if (takeIt)
                            callback(null, value)
                        else
                            source.next(handler);
                    })
                }
            })
        }
        return new this.constructor(this)
    }

    this.slice = function(begin, end) {
        var count = -1
        if (!end || end < 0)
            var end = Infinity
        
        var source = this.source
        this.next = function(callback) {
            source.next(function handler(err, value) {
                count++;
                if (err)
                    callback(err)
                else if (count >= begin && count < end)
                    callback(null, value)
                else if (count >= end)
                    callback(STOP);
                else
                    source.next(handler)
            })
        }
        return new this.constructor(this)
    }
    
    this.reduce = function(reduce, initialValue) {
        reduce = makeAsync(3, reduce)

        var index = 0;
        var previousValue = initialValue
        
        var source = this.source;
        this.next = function(callback) {
            if (initialValue === undefined) {
                source.next(function(err, currentValue) {
                    if (err)
                        return callback(err, previousValue)
                    
                    previousValue = currentValue;
                    reduceAll()
                });
            }
            else
                reduceAll()

            function reduceAll() {
                source.next(function handler(err, currentValue) {
                    if (err)
                        return callback(err, previousValue)
                
                    reduce(previousValue, currentValue, index++, function(err, value) {
                        previousValue = value;
                        source.next(handler);
                    })
                })
            }            
        }
        return new this.constructor(this)
    }
    
    this.each = function(fn) {
        fn = makeAsync(1, fn)
            
        var source = this.source;
        this.next = function(callback) {
            source.next(function handler(err, value) {
                if (err) 
                    callback(err)
                else {
                    fn(value, function(err) {
                        callback(err, value)
                    })
                }
            })
        }
        return new this.constructor(this)
    }
    
    this.delay = function(delay) {
        return this.each(function(item, next) {
            setTimeout(next, delay)
        })
    }
    
    this.callEach = function() {
        var source = this.source;
        return this.map(function(fn, next) {
            fn = makeAsync(0, fn)
            fn(function(err, value) {
                next(err, value)
            })
        })
    }
    
    this.concat = function(generator) {
        var generators = [this];
        generators.push.apply(generators, arguments)
        var index = 0;
        var source = generators[index++];
        
        return new this.constructor(function(callback) {            
            source.next(function handler(err, value) {
                if (err) {
                    if (err == STOP) {
                        source = generators[index++]
                        if (!source)
                            return callback(STOP)
                        else
                            return source.next(handler)
                    }
                    else
                        return callback(err)
                }
                else
                    return callback(null, value)
            })
        })
    }
    
    this.zip = function(generator) {
        var generators = [this];
        generators.push.apply(generators, arguments)
        
        return new this.constructor(function(callback) {
            exports.list(generators)
                .map(function(gen, next) {                    
                    gen.next(next)
                })
                .toArray(callback)
        })
    }
    
    this.end = function(callback) {
        var source = this.source;
        source.next(function handler(err, value) {
            if (err) 
                callback && callback(err == STOP ? null : err, value)
            else 
                source.next(handler)
        })        
    }
    
    this.toArray = function(callback) {
        var arr = [];
        var source = this.source;
        
        source.next(function handler(err, value) {
            if (err) {
                if (err == STOP)
                    callback(null, arr)
                else
                    callback(err)
            }
            else {
                arr.push(value)
                source.next(handler)
            }
        })
    }

}).call(exports.Generator.prototype)

var makeAsync = exports.makeAsync = function(args, fn, context) {
    if (fn.length > args) 
        return fn
    else {
        return function() {
            var value;
            var next = arguments[args];
            try {
                value = fn.apply(context || this, arguments)
            } catch(e) {
                return next(e);
            }
            next(null, value);
        }
    }
}


exports.list = function(arr, construct) {
    var construct = construct || exports.Generator
    var i = 0
    var len = arr.length
    
    return new construct(function(callback) {
        if (i < len)
            callback(null, arr[i++])
        else
            callback(STOP)
    })
}

/**
 * range([start,] stop[, step]) -> generator of integers
 *
 * Return a generator containing an arithmetic progression of integers.
 * range(i, j) returns [i, i+1, i+2, ..., j-1]; start (!) defaults to 0.
 * When step is given, it specifies the increment (or decrement).
 */ 
exports.range = function(start, stop, step, construct) {
    var construct = construct || exports.Generator
    start = start || 0
    step = step || 1
    
    if (stop === undefined || stop === null)
        stop = step > 0 ? Infinity : -Infinity
        
    var value = start
    
    return new construct(function(callback) {
        if (step > 0 && value >= stop || step < 0 && value <= stop)
            callback(STOP)
        else {
            var current = value;
            value += step;
            callback(null, current)
            
        }
    })
}