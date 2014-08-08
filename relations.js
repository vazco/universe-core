'use strict';

// TODO: error handling
// adds relation to plain js object
// doc - plain object
// toDoc - make relation to this
Uni.appendRelations = function(doc, toDocs, relationName) {
    var uniIds = this._toUniIds(toDocs);

    if (doc) {
        doc.relations = doc.relations || {};
        doc.relations[relationName] = doc.relations[relationName] || [];
        _(doc.relations[relationName]).union(uniIds);
    } else {
        throw new Error('appendRelations must take object as first parameter.')
    }
    return doc;
};

Uni.insertWithRelations = function (doc, toDocs, relationName, collection) {
    collection = this._toCollectionName(collection);
    this.appendRelations(doc, toDocs, relationName);
    return new Uni.Class.UniId(
        this.getCollection(collection).insert(doc),
        collection
    );
};

Uni.addRelations = function (doc, toDocs, relationName, callback) {
    var uniIds = this._toUniIds(toDocs),
        mod = this._getAddRelationMod(uniIds, relationName);

    Uni.updateDoc(doc, mod, {}, callback);
};

Uni._getAddRelationMod = function (uniIds, relationName) {
    var mod = {$addToSet: {}};
    if (_.isString(relationName)) {
        mod.$addToSet['relations.' + relationName] = {
            $each: uniIds
        };
        return mod;
    } else {
        throw  new Error('Relation name must be a string.');
    }
};

Uni.removeRelation = function (doc, toDoc, relationName, callback) {
    var uniId = this._toUniId(toDoc),
        mod = this._getRemoveRelationMod(uniId, relationName);

    Uni.updateDoc(doc, mod, {}, callback);
};

Uni._getRemoveRelationMod = function (unIds, relationName) {
    var mod = {$pull: {}};
    if (_.isString(relationName)) {
        mod.$pull['relations.' + relationName] = uniIds;
        return mod;
    } else {
        throw  new Error('Relation name must be a string.');
    }
};

Uni.addMutualRelation = function (doc, toDoc, relationName, callback) {
    Uni.addRelations(doc, toDoc, relationName, callback);
    Uni.addRelations(toDoc, doc, relationName, callback);
};

Uni.removeMutualRelation = function (doc, toDoc, relationName, callback) {
    Uni.removeRelation(doc, toDoc, relationName, callback);
    Uni.removeRelation(toDoc, doc, relationName, callback);
};