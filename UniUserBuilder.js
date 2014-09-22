UniUserBuilder = _.compose(function (doc) {
    doc.getName = function () {
        if (this.profile) {
            return this.profile.name;
        }
    };
    doc.isMe = function () {
        return Meteor.userId() === this._id;
    };
    return doc;
}, UniDocBuilder);