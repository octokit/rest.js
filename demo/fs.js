var async = require("../lib/async")

async.readdir(".")
    .stat()
    .filter(function(file) {
        return file.stat.isFile()
    })
    .readFile()
    .each(function(file) {
        console.log(file.data)
    })
    .end()