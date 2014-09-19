UniCollection = function(){
    Meteor.Collection.apply(this, arguments);
    this._helpers = {};
    this.setDoc(UniDoc);
};

var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype;

UniCollection.prototype.setDoc = function(doc){
    var self = this;
    this._docModel = doc;
    this._transform = function(doc){
        doc = self._docModel(doc);
        doc.getCollection = function() { return self; };
        _.each(self._helpers, function(helper, key) {
            doc[key] = helper;
        });
        return doc;
    };
};

UniCollection.prototype.helpers = function(helpers) {
    var self = this;
    _.each(helpers, function(helper, key) {
        self._helpers[key] = helper;
    });
};
