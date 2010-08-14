#!/usr/bin/env node

var async = require("../lib/async")

function ls(pattern, callback) {
    async.glob(pattern)
        .filter(filterHidden)
        .stat()
        .sort(function(file1, file2) {
            return file1.stat.isDirectory() + 0 > file2.stat.isDirectory() + 0
        })
        .each(function(file, next) {
            if (file.stat.isDirectory()) {
                console.log("\n" + file.path + ":")
                async.readdir(file.path)
                    .filter(filterHidden)
                    .stat()
                    .each(printFile)
                    .end(next)
            }
            else {
                printFile(file)
                next()
            }
        })
        .end(callback)
        
    function filterHidden(file) {
        return file.name.charAt(0) !== "."
    }
    
    function printFile(file) {
        var stat = file.stat
        var owner = stat.uid + ":" + stat.gid
        console.log([
            modeString(stat.mode), 
            pad(owner, 8),
            pad(stat.size + "", 6),
            file.path
        ].join(" "))
    }
    
    function modeString(mode) {
        var rights = [
            "---",
            "-w-",
            "--x",
            "-wx",
            "r--",
            "r-x",
            "rw-",
            "rwx"
        ]
        return (
            rights[mode >> 6 & 0x7] +
            rights[mode >> 3 & 0x7] +
            rights[mode & 0x7]
        )
    }
    
    function pad(str, length) {
        if (str.length >= length)
            return str
        else
            return new Array(length - str.length + 1).join(" ") + str
    }
}

// very simplistic ls
function ls1(pattern, callback) {
    async.glob(pattern)
        .get("path")
        .print()
        .end(callback)
}

ls(process.argv[2] || ".")