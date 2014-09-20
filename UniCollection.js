UniCollection = function(){
    'use strict';
    Meteor.Collection.apply(this, arguments);
    this._docHelpers = {};
    this.setDoc(UniDoc);
};

var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype;

UniCollection.prototype.setDoc = function(doc){
    var self = this;
    this._docModel = doc;
    this._transform = function(doc){
        self._docModel(doc);
        doc.getCollection = function() { return self; };
        _.each(self._docHelpers, function(helper, key) {
            doc[key] = helper;
        });
        return doc;
    };
};

UniCollection.prototype.helpers = function(helpers) {
    var self = this;
    _.each(helpers, function(helper, key) {
        self._docHelpers[key] = helper;
    });
};
