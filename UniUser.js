// ----- Prototype methods -----

UniUser = UniDoc.extend();

UniUser.prototype.getName = function () {
    if (this.profile) {
        return this.profile.name;
    }
};

UniUser.prototype.isMe = function () {
    return Meteor.userId() === this._id;
};

// ----- Collection clone -----

UniUsers = Object.create(Meteor.users);

UniUsers.setConstructor = UniCollection.prototype.setConstructor;
UniUsers.helpers = UniCollection.prototype.helpers;

UniUsers.setConstructor(UniUser);

// ----- Static methods -----

UniUsers.current = function () {
    return this.findOne(Meteor.userId());
};

UniUsers.currentId = function () {
    return Meteor.userId();
};