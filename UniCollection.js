UniCollection = function(){
    'use strict';
    var self = this;
    Meteor.Collection.apply(this, arguments);

    this.getCollection = function() { return self; };
    this._docHelpers = {};
    this.setBuilder(UniDocBuilder);
};

var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype();

UniCollection.prototype.setBuilder = function(docBuilder){
    var self = this;
    this._docBuilder = docBuilder;
    this._transform = function(doc){
        self._docBuilder(doc);
        doc.getCollection = function() { return self; };
        _.extend(doc, self._docHelpers);
        return doc;
    };
};

UniCollection.prototype.helpers = function(helpers) {
    var self = this;
    _.each(helpers, function(helper, key) {
        self._docHelpers[key] = helper;
    });
};

UniUsers = Object.create(Meteor.users);

UniUsers.setBuilder = UniCollection.prototype.setBuilder;
UniUsers.helpers = UniCollection.prototype.helpers;

UniUsers.setBuilder(UniUserBuilder);

UniUsers.current = function(){
    return UniUsers.findOne(Meteor.userId());
};

UniUsers.currentId = function(){
    var user = this.current();
    if(user){
        return user._id;
    }
};