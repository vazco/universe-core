UniDoc = {
    update: function (modifier, options, cb) {
        return this.getCollection().update(this._id, modifier, options, cb);
    },
    remove: function ( cb) {
        return this.getCollection().remove(this._id, cb);
    },
    save: function(){
        return this.update({$set: this});
    }
};