UniUser = function (doc) {
    UniDoc.call(this, doc);
};

_.extend(UniUser.prototype, UniDoc.prototype, {
    getName: function () {
        if (this.profile) {
            return this.profile.name;
        }
    },
    isMe: function () {
        return Meteor.userId() === this._id;
    }
});