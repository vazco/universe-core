'use strict';

Uni.Class.UniId = function UniId(_id, collection) {
    this._id = _id;
    this.collection = collection;
};

Uni.Class.UniId.prototype.equalsTo = function(uniId) {
    return (
        uniId &&
        uniId._id === this._id &&
        uniId.collection === this.collection
        );
};
