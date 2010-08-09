var async = require("../async")

async.plugin({
    delay: function(delay) {
        return this.each(function(item, next) {
            setTimeout(next, delay)
        })
    }
})


