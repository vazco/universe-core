'use strict';

// From UniId/doc to fresh doc.
Uni.findDoc = function(doc, options) {
    var uniId = this._toUniId(doc);

    options = options || {};

    return this.getCollection(uniId.collection).findOne(uniId._id, options);
};

// gets all documents in uniIds array
// gets array of uniIds and returns array of cursors
// if option.types is set only documents from that collections will be find
Uni.findDocs = function (uniIds, options) {
    var self = this,
        groups,
        result = [];
    options = options || {};
    if (uniIds) {
        groups = this._getQueryInfo(uniIds, options.types);
        _(groups).each(function (group, collection) {
            result.push(
                self.getCollection(collection)
                    .find({_id: {$in: group}}, options)
            );
        });
    }
    return result;
};

// From array of UniIds to single cursor
// Takes doc/uniId/collection as an example of type;
Uni.findDocsOfType = function(uniIds, type, options) {
    options = options || {};
    options.types = [type];
    return _(this.findDocs(uniIds, options)).first();
};

// find doc related to doc in first argument
Uni.findRelatedTo = function(doc, relationName, collection, options) {
    var uniId = this._toUniId(doc),
        query = {};
    options = options || {};
    if (uniId && _.isString(collection)) {
        query['relations.' + relationName + '._id'] = uniId._id;
        return this.getCollection(collection)
            .find(query, options);
    }
};


// --------------- Doc update methods ---------------

Uni.updateDoc = function (doc, modifier, options, callback) {
    var uniId = this._toUniId(doc);

    options = options || {};

    return this.getCollection(uniId.collection).update(uniId._id, modifier, options, callback);
};

// update all documents in uniIds array
Uni.updateDocs = function (uniIds, modifier, options, callback) {
    var self = this,
        groups;

    options = _({multi: true})
        .extend(options);

    if (uniIds) {
        groups = this._getQueryInfo(uniIds, options.types);
        _(groups).each(function (group, collection) {
            self.getCollection(collection)
                .update({_id: {$in: group}}, modifier, options, callback);
        });
    }
};

// update all documents in uniIds array
Uni.updateDocsOfType = function (uniIds, type, modifier, options, callback) {
    options = options || {};
    options.types = [type];
    return this.updateDocs(uniIds, modifier, options, callback);
};

// --------------- Doc remove methods ---------------

Uni.removeDoc = function (doc, callback) {
    var uniId = this._toUniId(doc);

    return this.getCollection(uniId.collection).remove(uniId._id, callback);
};

// remove all documents in uniIds array
Uni.removeDocs = function (uniIds, options, callback) {
    var self = this,
        groups;

    if (uniIds) {
        groups = this._getQueryInfo(uniIds, options.types);
        _(groups).each(function (group, collection) {
            self.getCollection(collection)
                .remove({_id: {$in: group}}, callback);
        });
    }
};

// update all documents in uniIds array
Uni.removeDocsOfType = function (uniIds, type, options, callback) {
    options = options || {};
    options.types = [type];
    return this.removeDocs(uniIds, options, callback);
};

// -------------- Utilities ----------

// From array of cursors to array of entities
Uni.fetchDocs = function(cursors) {
    var result = [];
    if (cursors) {
        _(cursors).each(function(cursor) {
            result = result.concat(cursor.fetch());
        });
    }
    return result;
};

// group uniId by collecion
// returns object : { <collecionName>: [ array of ids ] }
Uni.groupDocs = function(uniIds){
    var result = {},
        self = this;
    _(uniIds).each(function(uniId) {
        uniId = self._toUniId(uniId);
        result[uniId.collection] = result[uniId.collection] || [];
        result[uniId.collection].push(uniId._id);
    });
    return result;
};

// From array of UniIds to array of ids from one collection.
Uni.filterByType = function (uniIds, type) {
    var collection = this._toCollectionName(type),
        ids = [];
    if (collection) {
        _(uniIds).each(function (uniId) {
            if (uniId.collection === collection) {
                ids.push(uniId._id);
            }
        });
    }
    return ids;
};

Uni._getQueryInfo = function (uniIds, types) {
    var result = {},
        self = this,
        ids,
        collections,
        collection;
    if (types && types.length === 1) {
        collection = this._toCollectionName(_(types).first());
        ids = this.filterByType(uniIds, collection);
        if(collection && ids.length > 0){
            result[collection] = ids;
            return result
        }
    }
    else if (types) {
        collections = _(types).map(function (col) {
            return self._toCollectionName(col);
        });
        return _(this.groupDocs(uniIds)).pick(collections);
    } else {
        return this.groupDocs(uniIds);
    }
};