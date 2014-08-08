'use strict';

Uni.publishWithUser = function(func) {
    return function() {
        this.user = UniUsers.findOne(this.userId);
        if (this.user) {
            func.apply(this, arguments);
        }
    };
};