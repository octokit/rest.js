var async = require("../async")

async.plugin({}, {
    forEach: function(list, eachFn, callback) {
        async.list(list).each(eachFn).end(callback)
    },

    exports.map = function(list, mapper, callback) {
        async.list(list).map(mapper).toArray(callback)
    },

    exports.chain = function(funcs) {
        async.list(funcs.slice(0, -1)).call().end(funcs[funcs.length])
    }
})