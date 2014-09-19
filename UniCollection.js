//UniCollection = function(){
//    Meteor.Collection.apply(this, arguments);
//    var self = this;
//
//    self.Document = function(doc) { return _.extend(this, doc); };
//    self._transform = function(doc) { return new self.Document(doc); };
//
//    this.helpers = function(helpers) {
//        _.each(helpers, function(helper, key) {
//            self.Document.prototype[key] = helper;
//        });
//    }
//
//    this.helpers(_.extend({getCollection: function(){
//        return self;
//    }}, UniDoc));
//
//};
//
//
//var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
//UniCollectionPrototype.prototype = Meteor.Collection.prototype;
//UniCollection.prototype = new UniCollectionPrototype;

////////////////////////////
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
        _.extend(doc, this._helpers);
        return doc;
    };
};

UniCollection.prototype.helpers = function(helpers) {
    var self = this;
    _.each(helpers, function(helper, key) {
        self._helpers[key] = helper;
    });
};

UniBook = function(doc){
    doc.isReaded = false;

    doc.read = function(){
        this.isReaded = true;
    }

    return doc;
};

UniBook = _.compose(UniBook, UniDoc);