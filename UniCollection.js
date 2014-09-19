UniCollection = function(){
    var params = _.toArray(arguments);

    if(params.length > 1){
        if(_.isObject(params[1])){
            params[1].transform = UniDoc.init;
        } else {
            throw new Meteor.Error(404, 'Missing params?');
        }

    } else{
        params.push({
            transform: UniDoc.init
        });
    }
    Mongo.Collection.apply(this, params);

    var Document = [];
    this.helpers = function(helpers) {
        var self = this;

        if (! self._hasCollectionHelpers) {
            Document[self._name] = function(doc) { return _.extend(this, doc); };
            self._transform = function(doc) { return new Document[self._name](UniDoc.init(doc)); };
            self._hasCollectionHelpers = true;
        }

        _.each(helpers, function(helper, key) {
            Document[self._name].prototype[key] = helper;
        });
    }
};

UniCollection.prototype = Mongo.Collection.prototype;