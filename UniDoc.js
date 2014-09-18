UniDoc = (function () {
    function UniDoc(doc) {
        _.extend(this, doc);
    }

    UniDoc.init = function (doc) {
        return new this(doc);
    };

    UniDoc.create = function (doc) {
        doc = this.init(doc);
        doc._id = this.insert(doc);
        return doc;
    };

    UniDoc.insert = function (doc, cb) {
        return this.collection.insert(doc, cb);
    };

    UniDoc._addTransform = function (options) {
        var self = this;
        if (options.transform !== null) {

            //TODO: optimize this. now we create function for every find.
            options.transform = function (doc) {
                return self.init(doc);
            }
        }
    };

    UniDoc.find = function (selector, options) {
        selector = selector || {};
        options = options || {};
        this._addTransform(options);

        return this.collection.find(selector, options);
    };

    UniDoc.findOne = function (selector, options) {
        selector = selector || {};
        options = options || {};
        this._addTransform(options);

        return this.collection.findOne(selector, options);
    };

    UniDoc.update = function (selector, modifier, options, cb) {
        return this.collection.update(selector, modifier, options, cb);
    };

    UniDoc.remove = function (selector, cb) {
        return this.collection.remove(selector, cb);
    };

    UniDoc.prototype.update = function (modifier, options, cb) {
        return this.constructor.update(this._id, modifier, options, cb);
    };

    UniDoc.prototype.remove = function () {
        this.constructor.remove(this._id);
    };

    UniDoc.prototype.reload = function () {
        return this.constructor.findOne(this._id);
    };

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
            operator = '$' + operator;
            var mod = {};
            setObj = setObj || {};
            mod[operator] = setObj;
            return this.update(mod, options, callback);
        };
    });

    UniDoc.extend = function (staticProps, protoProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    return UniDoc;

})();