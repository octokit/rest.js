
var async = require("../lib/async")

function postOrder(next) {
    console.log("")
    console.log("post order walker:")
    async.walkfiles(__dirname)
        .each(function(file) {
            console.log(file.path)
        })
        .end(next)
}

function inOrder(next) {
    console.log("")
    console.log("in order walker:")
    async.walkfiles(__dirname, null, true)
        .each(function(file) {
            console.log(file.path)
        })
        .end(next)
}

function filerAssets(next) {
    console.log("")
    console.log("filter assets directory")
    var filter = function(file) {
        return file.name !== "assets" || !file.stat.isDirectory()
    }
    async.walkfiles(__dirname, filter, true)
        .each(function(file) {
            console.log(file.path)
        })
        .end(next)
}

async.list([postOrder, inOrder, filerAssets]).call().end()