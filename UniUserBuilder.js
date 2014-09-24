var docMethods = {
    getName: function () {
        if (this.profile) {
            return this.profile.name;
        }
    },
    isMe: function () {
        return Meteor.userId() === this._id;
    }
};


UniUserBuilder = _.compose(function (doc) {
    return _.extend(doc, docMethods);
}, UniDocBuilder);