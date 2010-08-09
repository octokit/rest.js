/*!
 * async.js
 * Copyright(c) 2010 Fabian Jakobs <fabian.jakobs@web.de>
 * MIT Licensed
 */

var async = require("../async")

async.plugin({
    delay: function(delay) {
        return this.each(function(item, next) {
            setTimeout(next, delay)
        })
    }
})


