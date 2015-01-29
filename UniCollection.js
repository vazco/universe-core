'use strict';

/* global UniDoc: true */
UniCollection = function () {
    var self = this;
    Meteor.Collection.apply(this, arguments);

    var args = Array.prototype.slice.call(arguments, 0),
        constructor;

    if (args.length === 2 && args[1] && args[1].docConstructor) {
        if (!_.isFunction(args[1].docConstructor)) {
            throw new Error('docConstructor must be a function.');
        }
        constructor = args[1].docConstructor;
    } else {
        constructor = UniDoc.extend();
    }

    this._getCollection = function () {
        return self;
    };
    this.setConstructor(constructor);
};

var UniCollectionPrototype = function () {
    this.constructor = UniCollection;
};
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype();

/**
 * Sets transformation function for collection.
 * Function passed as an argument will be executed for each document
 * to transform selected documents before the method (like: find, findOne) returns them.
 * UniDoc is a default of document constructor.
 * A good way is inheritance of UniDoc, instead create new constructor
 * @param docConstructor transformation function
 * @see UniDoc
 */
UniCollection.prototype.setConstructor = function (docConstructor) {
    var self = this;
    this._docConstructor = docConstructor;
    this._docConstructor.prototype.getCollection = this._getCollection;
    this._transform = function (doc) {
        return new self._docConstructor(doc);
    };
};

/**
 * Using this method you can add new helpers function into document prototype.
 * It's alternative way to setConstructor.
 * All of this methods will be added to returned document by function find, findOne
 * @param helpers
 */
UniCollection.prototype.helpers = function (helpers) {
    var self = this;
    _.each(helpers, function (helper, key) {
        self._docConstructor.prototype[key] = helper;
    });
};

/**
 * Checks if document belongs to collection name
 * @param doc it must be an universe document ( transformed by universe )
 * @returns boolean
 */
UniCollection.isDocumentFromCollection = function(doc, collectionName){
    if(_.isObject(doc) && doc.getCollection){
        return doc.getCollection()._name === collectionName;
    }
};

/**
 * Checks if document belongs to this collection
 * @param doc object or id (on client side you must have this doc in minimongo![subscription needed])
 * @returns boolean
 */
UniCollection.prototype.hasDocument = function(doc){
    if(_.isString(doc)){
        doc = this.findOne(doc);
    }
    return UniCollection.isDocumentFromCollection(doc, this._name);
};

/**
 * Gets options from field in the collections schema
 * @param fieldNam: String - schema field name in the collection
 * @returns {[]} <fieldName>autoform.options key in schema
 */
UniCollection.prototype.getFieldOptionsFromSchema = function (fieldName) {
    if(!_.isFunction(this.simpleSchema)){
        throw new Meteor.Error('Simple Schema is not attached on this collection!');
    }
    if (_.isString(fieldName)) {
        var field = this.simpleSchema().schema(fieldName);
        if(!field){
            console.error('Missing field in the schema, field name: "' + fieldName + '"');
            return;
        }
        var options = Vazco.get(field, 'autoform.options');
        if (_.isArray(options)) {
            return options;
        } else {
            console.warn('Missing options array in the schema for field "' + fieldName + '"');
            return;
        }
    }
};