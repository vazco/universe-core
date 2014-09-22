UniCollection = function(){
    'use strict';
    Meteor.Collection.apply(this, arguments);
    this._docHelpers = {};
    this.setDoc(UniDoc);
};

var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype;
UniCollection.prototype._checkModel = function(docModel){
    var docObject = docModel({});
    if(_.isObject(docObject)){
        for(prop in docObject){
            if(_.has(docObject, prop) && !_.isFunction(prop)){
                throw new Meteor.Error(500, 'DocModel must contain only functions');
            }
        }
    }
};

UniCollection.prototype.setDoc = function(docModel){
    var self = this;
    this._checkModel(docModel);

    this._docModel = docModel;
    _.each(self._docHelpers, function(helper, key) {
        doc[key] = helper;
    });
    this._transform = function(doc){
        self._docModel(doc);
        doc.getCollection = function() { return self; };
        return doc;
    };
};

UniCollection.prototype.helpers = function(helpers) {
    var self = this;
    _.each(helpers, function(helper, key) {
        self._docHelpers[key] = helper;
    });
};
