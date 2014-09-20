_UniUsers = function(){
    var self = this;
    this._docHelpers = {};
    this.setDoc = function(doc){
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
    this.setDoc(UniDoc);
    this.helpers = function(helpers) {
        var self = this;
        _.each(helpers, function(helper, key) {
            self._docHelpers[key] = helper;
        });
    };

    if(_.isObject(Meteor.users)){
        for(k in Object.getOwnPropertyNames(Meteor.users)){
            if(_.isFunction(Meteor.users[k])){
                self[k] = function(){
                    return Meteor.users[k].apply(Meteor.users, arguments)
                };
            }

        }
    }

    this.find = function (selector, options) {
        selector = selector || {};
        options = options || {};
        options.transform = self._transform;

        return Meteor.users.find(selector, options);
    };

    this.findOne = function (selector, options) {
        selector = selector || {};
        options = options || {};
        options.transform = self._transform;
        return Meteor.users.findOne(selector, options);
    };

    this.current = function(){
        var id = Meteor.userId();
        return id? this.findOne(id): null;
    }
};

UniUsers = new _UniUsers();






