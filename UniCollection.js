UniCollection = function(){
    'use strict';
    var self = this;
    Meteor.Collection.apply(this, arguments);

    var args = Array.prototype.slice.call(arguments, 0),
        constructor;

    if(args.length===2){

        var params = args[2] || {};
        if(!_.isFunction(params.constructor)){
            throw new Error('Constructor must be a function.')
        }
        constructor = params.constructor;

    } else {

        constructor = function UniDefaultDoc(doc) {
            UniDoc.call(this, doc);
        };
        var surrogate = function(){ this.constructor = constructor; };
        surrogate.prototype = UniDoc.prototype;
        constructor.prototype = new surrogate();
    }

    this.getCollection = function() { return self; };
    this.setConstructor(constructor);
};


var UniCollectionPrototype = function(){ this.constructor = UniCollection; };
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype();

UniCollection.prototype.setConstructor = function(docConstructor){
    var self = this;
    this._docConstructor = docConstructor;

    this._transform = function(doc){
        doc.getCollection = function() { return self; };
        return new docConstructor(doc);
    };
};

UniCollection.prototype.helpers = function(helpers) {
    var self = this;
    _.each(helpers, function(helper, key) {
        self._docConstructor.prototype[key] = helper;
    });
};

UniUsers = Object.create(Meteor.users);

UniUsers.setConstructor = UniCollection.prototype.setConstructor;
UniUsers.helpers = UniCollection.prototype.helpers;

UniUsers.setConstructor(UniUser);

UniUsers.current = function(){
    return this.findOne(Meteor.userId());
};

UniUsers.currentId = function(){
    var user = this.current();
    if(user){
        return user._id;
    }
};