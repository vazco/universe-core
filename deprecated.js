Vazco =  Vazco  || UniUtils;
App = App || {};
Colls = Colls || {};
UniCollection.prototype.helpers = UniCollection.prototype.docHelpers;
UniCollection.prototype.setDocumentPrototype = UniCollection.prototype.setDocumentClass;
/**
 * Gets options from field in the collections schema
 * @param fieldNam: String - schema field name in the collection
 * @returns {[]} <fieldName>autoform.options key in schema
 * @deprecated this function will be removed
 */
UniCollection.prototype.getFieldOptionsFromSchema = function (fieldName) {
    if (!_.isFunction(this.getSchema)) {
        throw new Meteor.Error('Simple Schema is not attached on this collection!');
    }
    var schema = this.getSchema() || UniUtils.get(this, '_c2._simpleSchema');

    if (_.isString(fieldName) && schema) {
        var field = _.isFunction(schema.schema) ? schema.schema(fieldName) : schema[fieldName];
        if (!field) {
            console.error('Missing field in the schema, field name: "' + fieldName + '" collection:' + this.getCollectionName());
            return;
        }
        var options = UniUtils.get(field, 'autoform.options');
        if (_.isArray(options)) {
            return options;
        } else {
            console.warn('Missing options array in the schema for field "' + fieldName + '"');
            return;
        }
    }
};

UniCollection.prototype.addErrorSupportToAllWriteMethods = function() {
    var mixin = new UniCollection.mixins.ShowErrorMixin()
    mixin.mount(this);
    this._mixinInstances[mixin.name] = mixin;
};
