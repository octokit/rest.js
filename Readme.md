Examples
========

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