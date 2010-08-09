async.js
========

**A clean, composable way to manipulate sequences of values with asynchronous functions
**

Dealing with control flow in heavily asynchronous code can be a big challange. Without any helper functions the code can easily degenerate into a christmas tree shape because of the callback of a callback of a callback syndrome.

    asncFunction1(function(err, result) {
        asncFunction2(function(err, result) {
            asncFunction3(function(err, result) {
                asncFunction4(function(err, result) {
                    asncFunction5(function(err, result) {
                        // do something useful
                    })
                })
            })
        })
    })
    
With async.js this can be written as

    async.list([
        asncFunction1,
        asncFunction2,
        asncFunction3,
        asncFunction4,
        asncFunction5,
    ]).callEach().end(function(err, result) {
        // do something useful
    });
    
It gets even worse if an asynchronous function has to be applied to a sequence of values. There is a nice example of this in the  howtonode.org article [Control Flow in Node Part III](http://howtonode.org/control-flow-part-iii):

    // Here is the async version without helpers
    function loaddir(path, callback) {
      fs.readdir(path, function (err, filenames) {
        if (err) { callback(err); return; }
        var realfiles = [];
        var count = filenames.length;
        filenames.forEach(function (filename) {
          fs.stat(filename, function (err, stat) {
            if (err) { callback(err); return; }
            if (stat.isFile()) {
              realfiles.push(filename);
            }
            count--;
            if (count === 0) {
              var results = [];
              realfiles.forEach(function (filename) {
                fs.readFile(filename, function (err, data) {
                  if (err) { callback(err); return; }
                  results.push(data);
                  if (results.length === realfiles.length) {
                    callback(null, results);
                  };
                });
              });
            }
          });
        });
      });
    }
    
This code reads the contents of a directory, filters out all directory and returns the contens of all files as an array. Without any helpers the whole control flow management totally obscures the intent of the code. With async.js it is possible to move the control flow aspects of the code out of the function and rewrite it like this:

    function loaddir(path, callback)
    async.readdir(".")
        .stat()
        .filter(function(file) {
            return file.stat.isFile()
        })
        .readFile()
        .filter(function(file) {
            return file.data
        })
        .toString(callback)
    }

Examples
========

    async.range(1, 10)
        .each(function(item, next) {
            console.log(item);
            next();
        })
        .end(function(err) {
            console.log("end")
        });
    
    async.list([2, 4, 1, 3]).
        filter(function(item, next) {
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
        });
    
    

Array Functions
===============

- reverse
- sort
- concat
- join
- slice

- filter
- forEach
- every
- some
- map
- some
- reduce

- callEach
- zip

Ideas
=====

- delay
- get (xhr)
- keys
- values


Demos
=====

- unit test
- source code loader
- fs - stat, copy