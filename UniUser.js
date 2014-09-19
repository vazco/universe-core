_UniUsers = function(){
    var self = this;
    self.Document = function(doc) { return _.extend(this, doc); };
    self._transform = function(doc) { return new self.Document(doc); };

    this.helpers = function(helpers) {
        _.each(helpers, function(helper, key) {
            self.Document.prototype[key] = helper;
        });
    }

    this.helpers(_.extend({getCollection: function(){
        return Meteor.users;
    }}, UniDoc));

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





