Demo
====

range(1, 10)
	.each(function(item, next) {
		console.log(item);
		next();
	})
	.end(function(err) {
		console.log("end")
	});
	
list([2, 4, 1, 3]).
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

reverse YES (DONE)
sort YES (DONE)
concat YES (DONE)
join YES (DONE)
slice YES (DONE)

filter YES (DONE)
forEach YES (DONE)
every YES (DONE)
some YES (DONE)
map YES (DONE)
some YES (DONE)
reduce YES (DONE)
reduceRight NO

callEach YES (DONE)
zip YES (DONE)


Ideas
=====

delay
get (xhr)
keys
values


Demos
=====

- unit test
- source code loader
- fs - stat, copy