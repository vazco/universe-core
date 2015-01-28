UniDoc = function (doc) {
    return _.extend(this, doc);
};

UniDoc.extend = function(){
    var newConstructor = function (doc) {
        UniDoc.call(this, doc);
    };
    var surrogate = function () {
        this.constructor = newConstructor;
    };
    surrogate.prototype = UniDoc.prototype;
    newConstructor.prototype = new surrogate();
    newConstructor.extend = UniDoc.extend;

    return newConstructor;
};

_.extend(UniDoc.prototype, {
    update: function (modifier, options, cb) {
        return this.getCollection().update(this._id, modifier, options, cb);
    },
    remove: function (cb) {
        return this.getCollection().remove(this._id, cb);
    },
    save: function (fieldsList) {
        if(_.isString(fieldsList)){
            fieldsList = [fieldsList];
        }
        if(!_.isArray(fieldsList)){
            throw new Meteor.Error(500, 'You must pass list of keys for save');
        }
        var obj = _.pick(this, fieldsList);
        return this.update({$set:obj});
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
        console.warn('Method "'+operator+'" is deprecated! please use update() or save() instead!');
        return this.update(mod, options, callback);
    };
});


