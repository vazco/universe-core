UniDoc = function (doc) {
    var self = this;
    doc.update = function (modifier, options, cb) {
        return self.update(this._id, modifier, options, cb);
    };
    doc.remove = function (cb) {
        return self.remove(this._id, cb);
    };
    doc.save = function () {
        var schema = self.simpleSchema();
        var d = {};
        _.each(this, function(v, k){
            if(!_.isFunction(v) && k != '_id'){
                if(schema){ //with simpleSchema
                    var oneFieldDef = schema.schema(k);
                    if(oneFieldDef && !oneFieldDef.denyUpdate){
                        d[k] = v;
                    }
                } else{ //without simpleSchema
                    d[k] = v;
                }
            }
        });
        return self.update(doc._id, {$set: d});
    };
    doc.refresh = function(){
        var doc = self.findOne(this._id, {transform: null});
        _.extend(this, doc);
    };
};