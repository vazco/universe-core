UniDoc = function (doc) {
    return _.extend(this, doc);
};

_.extend(UniDoc.prototype, {
    update: function (modifier, options, cb) {
        return this.getCollection().update(this._id, modifier, options, cb);
    },
    remove: function (cb) {
        return this.getCollection().remove(this._id, cb);
    },
    save: function () {
        var schema = this.getCollection().simpleSchema();
        var d = {};
        _.each(this, function (v, k) {
            if (!_.isFunction(v) && k != '_id') {
                if (schema) { //with simpleSchema
                    var oneFieldDef = schema.schema(k);
                    if (oneFieldDef && !oneFieldDef.denyUpdate) {
                        d[k] = v;
                    }
                } else { //without simpleSchema
                    d[k] = v;
                }
            }
        });
        return this.set(d);
    },
    refresh: function () {
    //FIXME: We must use simple schema (if exists) to clean deleted values
        var doc = this.getCollection().findOne(this._id, {transform: null});
        _.extend(this, doc);
    },
    findMe: function () {
        return this.getCollection().findOne(this._id);
    }
});

_([
    'inc',
    'set',
    'unset',
    'addToSet',
    'pop',
    'pull',
    'push'
]).each(function (operator) {
    UniDoc.prototype[operator] = function (setObj, options, callback) {
        var mod = {};
        setObj = setObj || {};
        mod['$' + operator] = setObj;
        return this.update(mod, options, callback);
    };
});


