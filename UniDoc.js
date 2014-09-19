UniDoc = function (doc) {
    var self = this;
    doc.update = function (modifier, options, cb) {
        return self.update(this._id, modifier, options, cb);
    };
    doc.remove = function (cb) {
        return self.remove(this._id, cb);
    };
    doc.save = function () {
        var data = {};
        var schema = self.simpleSchema();
        _.each(doc, function(v, k){
            if(!_.isFunction(v)){
                var p ={};
                p[k] =v;
                if(schema.newContext().validateOne(p, k)){
                    data[k] = v;
                }
            }
        });
        console.log(data);
        return doc.update({$set: data});
    };
    return doc;
};