/*!
 * async.js
 * Copyright(c) 2010 Fabian Jakobs <fabian.jakobs@web.de>
 * MIT Licensed
 */

var async = require("../lib/async")

async.readdir(__dirname)
    .stat()
    .filter(function(file) {
        return file.stat.isFile()
    })
    .readFile()
    .each(function(file) {
        console.log(file.data)
    })
    .end()


return
async.files(["1.txt", "2.txt", "3.txt"])
    .unlink()
    .end()