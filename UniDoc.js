UniDoc = {
    update: function (modifier, options, cb) {
        return this.getCollection().update(this._id, modifier, options, cb);
    },
    remove: function ( cb) {
        return this.getCollection().remove(this._id, cb);
    },
    save: function(){
    var keys = this.getCollection().simpleSchema().objectKeys();
    var doc = {};
    _.each(keys, function(k){
        doc[k] = this[k];

    });
        return this.update({$set: doc});
    }
};