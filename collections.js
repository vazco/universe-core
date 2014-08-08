'use strict';

Uni.createCollection = function createCollection(name, options) {
    var collection,
        constructor,
        col;

    options = options || {};

    // If no constructor is set, take UniDoc.
    // And also save constructor for closure.
    constructor = options.constructor = options.constructor || Uni.Class.Object;

    // If no schema is set, take schema from constructor.
    options.schema = options.schema || constructor.schema || null;

    if (options.transform !== null) {
        // If no transform function is set, take this one:
        options.transform = options.transform || function(doc) {
            return new constructor(doc, collection, col);
        };
    }

    // Make collection and save it for closure.
    collection = new Meteor.Collection(name, options);

    // Reference for UniId.
    collection._referenceName = name;

    // Make collection global.
    this.global[name] = collection;

    // Also store it inside Uni.collections object.
    this.collections = this.collections || {};
    this.collections[name] = collection;

    // Make Col and save it for closure.
    options.relations = options.relations || {};
    col = this.cols[name] = new Uni.Col(collection);

    // On created callback.
    if (options.onCreated) {
        options.onCreated(collection);
    }

    return collection;
};

Uni.getCollection = function(collection) {
    collection = this._toCollectionName(collection);
    if (!this.global[collection]) {
        throw new Error('Can\'t find collection: ' + collection);
    }
    return this.global[collection];
};