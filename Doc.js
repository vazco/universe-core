'use strict';

// --------------- Constructor -------------

Uni.Class.Doc = function UniDoc(doc, collection, col) {
    this._collection = collection;
    this._col = col;
    _.extend(this, doc);
};

// --------------- Relation methods ---------------

Uni.Class.Doc.prototype.hasRelation = function(relationName, doc) {
    var uniId = Uni._toId(doc);

    if (!uniId) {
        throw new Error('Second argument must be UniDoc or UniId instance.');
    }

    if (this.relations && _.isArray(this.relations[relationName])) {
        return _(this.relations[relationName]).some(function(relation) {
            return uniId.equalsTo(relation);
        });
    } else {
        return false;
    }
};

Uni.Class.Doc.prototype.getRelations = function(relationName) {
    if (this.relations && _.isArray(this.relations[relationName])) {
        return this.relations[relationName];
    }
};

Uni.Class.Doc.prototype.getFirstRelation = function(relationName) {
    if (this.relations && _.isArray(this.relations[relationName])) {
        return _.first(this.relations[relationName]);
    }
};

Uni.Class.Doc.prototype.addRelations = function (docs, relationName, callback) {
    return Uni.addRelations(this, docs, relationName, callback)
};

Uni.Class.Doc.prototype.addMutualRelation = function (doc, relationName, callback) {
    return Uni.addMutualRelation(this, doc, relationName, callback)
};

Uni.Class.Doc.prototype.removeRelation = function (doc, relationName, callback) {
    return Uni.removeRelation(this, doc, relationName, callback)
};

Uni.Class.Doc.prototype.removeMutualRelation = function (doc, relationName, callback) {
    return Uni.removeMutualRelation(this, doc, relationName, callback)
};

// -------------- Relations helpers ------------

Uni.Class.Doc.prototype.findRelated = function (relationName, options) {
    return Uni.findDocs(this.getRelations(relationName), options);
};

Uni.Class.Doc.prototype.findFirstRelated = function (relationName, options) {
    return Uni.findDoc(this.getFirstRelation(relationName), options);
};

Uni.Class.Doc.prototype.findRelatedOfType = function (relationName, type, options) {
    return Uni.findDocsOfType(this.getRelations(relationName), type, options);
};

Uni.Class.Doc.prototype.findRelatedToMe = function (relationName, collectionName, options) {
    return Uni.findRelatedTo(this, relationName, collectionName, options);
};

Uni.Class.Doc.prototype.updateAllRelated = function (relationName, modifier, options, callback) {
    return Uni.updateDocs(this.getRelations(relationName), modifier, options, callback);
};

Uni.Class.Doc.prototype.updateAllRelatedOfType = function (relationName, type, modifier, options, callback) {
    return Uni.updateDocsOfType(this.getRelations(relationName), type, modifier, options, callback);
};

Uni.Class.Doc.prototype.removeAllRelated = function (relationName, options, callback) {
    return Uni.removeDocs(this.getRelations(relationName), options, callback);
};

Uni.Class.Doc.prototype.removeAllRelatedOfType = function (relationName, type, options, callback) {
    return Uni.removeDocsOfType(this.getRelations(relationName), type, options, callback);
};

// --------------- UniId getter ---------------

// Object contains id and global collection reference.
Uni.Class.Doc.prototype.getUniId = function() {
    if (this._id && this._collection && this._collection._referenceName) {
        return new Uni.Class.UniId(this._id, this._collection._referenceName);
    }
};

// --------------- Doc manipulation helpers ------

// Helpers for update, remove directly on the object.
Uni.Class.Doc.prototype.update = function (modifier, options, callback) {
    return Uni.updateDoc(this, modifier, options, callback);
};

//_([
//    '$inc',
//    '$mul',
//    '$rename',
//    '$setOnInsert',
//    '$set',
//    '$unset',
//    '$min',
//    '$max',
//    '$currentDate',
//    '$addToSet',
//    '$pop',
//    '$pullAll',
//    '$pull',
//    '$push'
//]).each(function(operator) {
//    Uni.Class.Doc.prototype[operator] = function(setObj, options, callback) {
//        var mod = {};
//        setObj = setObj || {};
//        mod[operator] = setObj;
//        return this.update(mod, options, callback);
//    };
//});

Uni.Class.Doc.prototype.remove = function(callback) {
    return Uni.removeDoc(this, callback);
};

Uni.Class.Doc.prototype.getFresh = function() {
    return Uni.findDoc(this);
};

// ----------- Extend method taken from backbone.js ----------------

Uni.Class.Doc.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() { return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function() { this.constructor = child; };
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