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

UniUsers._getCollection = function(){
    return UniUsers;
};

UniUsers.setConstructor = UniCollection.prototype.setConstructor;
UniUsers.helpers = UniCollection.prototype.helpers;

UniUsers.setConstructor(UniUser);

// ----- Static methods -----
if(Meteor.isClient){
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
        if(!user){
            return false;
        }
        return user.isAdmin();
    };
}


/**
 * Checks if document belongs to this collection
 * @param doc object or id (on client side you must have this doc in minimongo![subscription needed])
 * @returns boolean
 */
UniUsers.hasDocument = function(doc){
    if(_.isString(doc)){
        doc = UniUsers.findOne(doc);
    }
    return UniCollection.isDocumentFromCollection(doc, UniUsers._name);
};

var _availablePermissions = {};
/**
 * Add new permission type
 * You must add new permission typ on server and client side
 * On UniUser you will be have function: user.hasPermissionOf<permissionName>
 * @example    for example moderator -> user.hasPermissionOfModerator
 * @param permissionName
 * @param description
 */
UniUsers.setNewPermissionType = function (permissionName, description) {
    _availablePermissions[permissionName] = description;
    var fnName = permissionName.charAt(0).toUpperCase() + permissionName.slice(1);
    UniUser.prototype['hasPermissionOf'+fnName] = function(){
        if (this.permissions && this.permissions[permissionName] === true) {
            return true;
        }
        return false;
    };
};
/**
 * Return an object of key/value pairs, like:  {permissionName: "Permission Description", ....}
 * Do this in a file accessible by both the server and client.
 */
UniUsers.availablePermissions = function () {
    return _availablePermissions;
};


UniUsers.validators = {
    checkUsername: function (username, userId) {
        if (!username || username.length < 4) {
            throw new Meteor.Error(403, 'Username must have at least 4 characters');
        }
        var usernamePattern = /^[a-z][a-z0-9_]+$/g;
        if (!usernamePattern.test(username)) {
            throw new Meteor.Error(
                403,
                'Username format is incorrect. Only lowercase letters and numbers are accepted');
        }
        var u = Meteor.users.findOne({username: username});
        if (u && (!userId || (u._id !== userId))) {
            throw new Meteor.Error(403, 'Username already in use.');
        }
        return true;
    },
    checkEmailAddress: function (address, userId) {
        if (address) {
            var emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
            if (!emailPattern.test(address)) {
                throw new Meteor.Error(400, 'Email Address format is incorrect.');
            }
            var u = Meteor.users.findOne({emails: {$elemMatch: {address: address}}});
            if (u && (!userId || (u._id !== userId))) {
                throw new Meteor.Error(400, 'Email Address already in use.');
            }
            return true;
        }
        return false;
    },
    checkDisplayName: function (name) {
        if (!name) {
            throw new Meteor.Error(400, 'Name can not be blank.');
        }
        return true;
    }
};
