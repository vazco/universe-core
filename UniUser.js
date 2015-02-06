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