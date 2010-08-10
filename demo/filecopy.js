
var async = require("../lib/async")

async.walkfiles(__dirname, null, true)
    .each(function(file) {
        console.log(file.path)
    })
    .end()