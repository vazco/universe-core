UniDoc = function (doc) {
    var self = this;
    doc.update = function (modifier, options, cb) {
        return self.update(doc._id, modifier, options, cb);
    };
    doc.remove = function (cb) {
        return self.remove(doc._id, cb);
    };
    doc.save = function () {
        var d = {};
        var schema = self.simpleSchema();
        _.each(doc, function(v, k){
            if(!_.isFunction(v)){
                if(schema.newContext().validateOne(doc, k)){
                    var oneFieldDef = schema.schema(k)
                    if(oneFieldDef && !oneFieldDef.denyUpdate){
                        d[k] = v;
                    }
                }
            }
        });
        return self.update(doc._id, {$set: d});
    };
    return doc;
};