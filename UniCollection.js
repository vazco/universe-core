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
UniCollection.prototype = new UniCollectionPrototype;

UniCollection.prototype.setBuilder = function(docBuilder){
    var self = this;
    this._docBuilder = docBuilder;
    this._transform = function(doc){
        self._docBuilder(doc);
        doc.getCollection = self.getCollection;
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
