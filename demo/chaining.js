var async = require("../lib/async");

var even = async.range(0, null, 2)
var odd = async.range(1, null, 2)

even.slice(0, 3).concat(odd.slice(0, 3))
    .toArray(function(err, arr) {
        console.log(arr)
    })

async.range(1, 5)
    .reduce(function(previousValue, currentValue) {        
        return previousValue + currentValue;
    })
    .end(function(err, value) {
        console.log("Sum over 1..4: " + value);
    })

async.range(1, 5)
    .reduce(function(previousValue, currentValue, index, next) {
        next(null, previousValue + currentValue);
    }, 10)
    .end(function(err, value) {        
        console.log("Sum over 1..4 + 10: " + value);
    })

async.range(1, 10)
    .delay(200)
    .each(function(item, next) {
        console.log(item);
        next();
    })
    .end(function(err) {
        console.log("end")
    })

async.range(10, null, 1)
    .slice(3, 9)
    .toArray(function(err, arr) {
        console.log(arr);
    })

async.list([2, 4, 1, 3])
    .filter(function(item, next) {
        next(null, item % 2 == 0);
    })
    .map(function(item, next) {
        next(null, item*2);
    })
    .map(function(item) {
        return item*2;
    })
    .toArray(function(err, arr) {
        console.log(arr);
    })
    
async.list([
    function sync() {
        console.log("first")
        return "juhu"
    },
    
    function async(next) {
        console.log("second")
        next(null, "kinners")
    }
]).callEach()
    .toArray(function(err, arr) {
        console.log(arr)
    })