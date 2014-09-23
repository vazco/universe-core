var getName = function () {
    if (this.profile) {
        return this.profile.name;
    }
};

var isMe = function () {
    return Meteor.userId() === this._id;
};

UniUserBuilder = _.compose(function (doc) {
    doc.getName = getName;
    doc.isMe = isMe;

    return doc;
}, UniDocBuilder);