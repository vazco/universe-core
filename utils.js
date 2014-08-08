'use strict';

Uni._toCollectionName = function (something) {
    if (_.isString(something)) {
        return something;
    } else if (something instanceof Meteor.Collection) {
        return something._referenceName;
    } else {
        return this._toUniId(something).collection;
    }
};

Uni._toId = function(something) {
    if (_.isString(something)) {
        return something;
    } else {
        return this._toUniId(something)._id;
    }
};

Uni._toUniId = function(something) {
    if (something instanceof this.Class.Doc) {
        return something.getUniId();
    } else if (something instanceof this.Class.UniId) {
        return something;
    } else if (this._uniIdLike(something)) {
        return new this.Class.UniId(something._id, something.collection);
    } else {
        throw new Error('Can\'t extract UniId from: ' + JSON.stringify(something));
    }
};

Uni._toUniIds = function (somethings) {
    var self = this,
        result = [];
    if (somethings && somethings.forEach) {
        somethings.forEach(function (something) {
            result.push(self._toUniId(something));
        });
    }
    return result;
};

Uni._toDoc = function (something) {
    var uniId;
    if (something instanceof Uni.Class.Doc) {
        return something;
    } else {
        uniId = this._toUniId(something);
        return this.findDoc(uniId)
    }
};

Uni._uniIdLike = function(uniIdLike) {
    return Match.test(uniIdLike, {
        _id: String,
        collection: String
    });
};

Uni._capitalLetter = function (string) {
    if (_.isString(string)) {
        return string[0]
            .toUpperCase() +
            string.substr(1, string.length - 1)
                .toLowerCase();
    }
};