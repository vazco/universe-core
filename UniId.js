'use strict';

Uni.Class.UniId = function UniId(_id, collection) {
    this._id = _id;
    this.collection = collection;
};

Uni.Class.UniId.prototype = {
    constructor: Uni.Class.UniId,
    toString: function() {
        return this.toJSONValue.toString();
    },
    clone: function() {
        return new Uni.Class.UniId(this._id, this.collection);
    },
    equals: function(other) {
        if (!(other instanceof Uni.Class.UniId))
            return false;

        return EJSON.stringify(this) === EJSON.stringify(other);
    },
    typeName: function() {
        return "UniId";
    },
    toJSONValue: function() {
        return {
            _id: this._id,
            collection: this.collection
        }
    }
};

EJSON.addType('UniId', function fromJSONValue(value) {
    return new Uni.Class.UniId(value._id, value.collection);
});
