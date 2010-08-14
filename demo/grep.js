#!/usr/bin/env node

var async = require("../lib/async")

function grep(pattern, file, callback) {
    async.glob(file)
        .stat()
        .filter(function(file) {
            return !file.stat.isDirectory()
        })
        .readFile()
        .each(function(file) {            
            var lines = file.data.toString("utf8").split("\n")
            delete file.data
            
            lines.forEach(function(line) {
                if (line.match(pattern))
                    console.log(line)
            })
        })
        .end(callback)
}

var argv = process.argv

if (argv.length !== 4)
    console.log("Usage: grep PATTERN FILE")
else
    grep(argv[2], argv[3])