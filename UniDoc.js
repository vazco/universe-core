UniDoc = {
    update: function (modifier, options, cb) {
        return this.getCollection().update(this._id, modifier, options, cb);
    },
    remove: function ( cb) {
        return this.getCollection().remove(this._id, cb);
    },
    save: function(){
    var keys = this.getCollection().simpleSchema().objectKeys();
    var doc = _.pick(this, keys);
        console.log(doc, this);
        return this.update({$set: doc});
    }
};