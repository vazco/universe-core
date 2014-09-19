UniCollection = function(){
    Meteor.Collection.apply(this, arguments);
    var self = this;

    self.Document = function(doc) { return _.extend(this, doc); };
    self._transform = function(doc) { return new self.Document(doc); };

    this.helpers = function(helpers) {
        _.each(helpers, function(helper, key) {
            self.Document.prototype[key] = helper;
        });
    }

    this.helpers(_.extend({getCollection: function(){
        return self;
    }}, UniDoc));

};


var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype;