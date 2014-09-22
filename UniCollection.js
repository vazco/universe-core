UniCollection = function(){
    'use strict';
    var self = this;
    Meteor.Collection.apply(this, arguments);
    
    this.getCollection = function() { return self; };
    
    this._docHelpers = {};
    this.setDocConstructor(UniDoc);
};

var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype();

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

UniCollection.prototype.setDocConstructor = function(docModel){
    var self = this;
    this._checkModel(docModel);
    this._docModel = docModel;
    this._transform = function(doc){
        self._docModel(doc);
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
