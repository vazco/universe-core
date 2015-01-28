'use strict';

/* global UniUser: true */

// ----- Prototype methods -----

UniUser = UniDoc.extend();

UniUser.prototype.getName = function () {
    if (this.profile) {
        return this.profile.name;
    }
};

UniUser.prototype.isLoggedIn = function () {
    return Meteor.userId() === this._id;
};

UniUser.prototype.isAdmin = function () {
    return this.is_admin;
};

// ----- Collection clone -----
/* global UniUsers: true */
UniUsers = Object.create(Meteor.users);

UniUsers.setConstructor = UniCollection.prototype.setConstructor;
UniUsers.helpers = UniCollection.prototype.helpers;

UniUsers.setConstructor(UniUser);

// ----- Static methods -----

UniUsers.getLoggedIn = function () {
    return this.findOne(Meteor.userId());
};

UniUsers.getLoggedInId = function () {
    return Meteor.userId();
};

UniUsers.isLoggedIn = function () {
    return !!Meteor.userId();
};

UniUsers.isAdminLoggedIn = function () {
    var user = UniUsers.getLoggedIn();
    return user.isAdmin();
};