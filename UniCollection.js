UniCollection = function () {
    var self = this;
    Meteor.Collection.apply(this, arguments);

    var args = Array.prototype.slice.call(arguments, 0),
        constructor;

    if (args.length === 2 && args[1].docConstructor) {
        if (!_.isFunction(args[1].docConstructor)) {
            throw new Error('docConstructor must be a function.')
        }
        constructor = args[1].docConstructor;
    } else {
        constructor = UniDoc.extend();
    }

    this.getCollection = function () {
        return self;
    };
    this.setConstructor(constructor);
};

var UniCollectionPrototype = function () {
    this.constructor = UniCollection;
};
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype();

UniCollection.prototype.setConstructor = function (docConstructor) {
    var self = this;
    this._docConstructor = docConstructor;

    this._transform = function (doc) {
        doc.getCollection = function () {
            return self;
        };
        return new self._docConstructor(doc);
    };
};

UniCollection.prototype.helpers = function (helpers) {
    var self = this;
    _.each(helpers, function (helper, key) {
        self._docConstructor.prototype[key] = helper;
    });
};