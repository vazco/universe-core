'use strict';

/* global UniCollection: true */
UniCollection = function () {
    var self = this;
    Meteor.Collection.apply(this, arguments);

    var args = Array.prototype.slice.call(arguments, 0),
        constructor;

    if (args.length === 2 && args[1] && args[1].docConstructor) {
        if (!_.isFunction(args[1].docConstructor)) {
            throw new Error('docConstructor must be a function.');
        }
        constructor = args[1].docConstructor;
    } else {
        constructor = UniCollection.UniDoc.extend();
    }

    this._getCollection = function () {
        return self;
    };
    this.setConstructor(constructor);
    UniUtils.set(UniCollection, '_uniCollections.'+this._name, this);
};

var UniCollectionPrototype = function () {
    this.constructor = UniCollection;
};
UniCollectionPrototype.prototype = Meteor.Collection.prototype;
UniCollection.prototype = new UniCollectionPrototype();

/**
 * Sets transformation function for collection.
 * Function passed as an argument will be executed for each document
 * to transform selected documents before the method (like: find, findOne) returns them.
 * UniDoc is a default of document constructor.
 * A good way is inheritance of UniDoc, instead create new constructor
 * @param docConstructor transformation Object
 * @see UniDoc
 */
UniCollection.prototype.setConstructor = function (docConstructor) {
    var self = this;
    this._docConstructor = docConstructor;
    this._docConstructor.prototype.getCollection = this._getCollection;
    this._transform = function (doc) {
        return new self._docConstructor(doc);
    };
};

/**
 * Using this method you can add new helpers function into document prototype.
 * It's alternative way to setConstructor.
 * All of this methods will be added to returned document by function find, findOne
 * @param helpers
 */
UniCollection.prototype.helpers = function (helpers) {
    var self = this;
    _.each(helpers, function (helper, key) {
        self._docConstructor.prototype[key] = helper;
    });
};

/**
 * Checks if document belongs to collection name
 * @param doc it must be an universe document ( transformed by universe )
 * @returns boolean
 */
UniCollection.isDocumentFromCollection = function(doc, collectionName){
    if(_.isObject(doc) && doc.getCollection){
        return doc.getCollection()._name === collectionName;
    }
};

/**
 * Checks if document belongs to this collection
 * @param doc object or id (on client side you must have this doc in minimongo![subscription needed])
 * @returns boolean
 */
UniCollection.prototype.hasDocument = function(doc){
    if(_.isString(doc)){
        doc = this.findOne(doc);
    }
    return UniCollection.isDocumentFromCollection(doc, this._name);
};

/**
 * Gets options from field in the collections schema
 * @param fieldNam: String - schema field name in the collection
 * @returns {[]} <fieldName>autoform.options key in schema
 */
UniCollection.prototype.getFieldOptionsFromSchema = function (fieldName) {
    if(!_.isFunction(this.simpleSchema)){
        throw new Meteor.Error('Simple Schema is not attached on this collection!');
    }
    if (_.isString(fieldName)) {
        var field = this.simpleSchema().schema(fieldName);
        if(!field){
            console.error('Missing field in the schema, field name: "' + fieldName + '"');
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

UniCollection._showError = function(text){
    if(_.isObject(text)){
        text = text.reason || text.message;
    }
    var uiShowErr;
    if(typeof UniUI === 'object'){
        uiShowErr = UniUI.setErrorMessage;
    } else if(UniUtils.setErrorMessage){
        uiShowErr = UniUtils.setErrorMessage;
    }
    if(uiShowErr){
        uiShowErr('header', text);
    } else {
        alert(text);
    }
};

/**
 * Adds error support for all updates on client side, even if callback for update wasn't provided.
 * When update is unsuccessful function 'onErrorFn' will be called
 * @param {function=} onErrorFn (optional) If is not passed then Vazco.setErrorMessage for 'header' place will be called
 * or alert if Vazco.setErrorMessage is missing (You can override this logic by replacing UniCollection._showError)
 */
UniCollection.prototype.addErrorSupportToUpdates = function(onErrorFn){
    if(Meteor.isServer){
        console.log('Default of error support for '+this._name+' cannot be applied on server side');
        return;
    }
    var _update = this.update;
    var collection = this;
    if(!_.isFunction(onErrorFn)){
        onErrorFn = UniCollection._showError;
    }
    this.update = function(){
        var self = this;
        var params = _.toArray(arguments);
        var ind = params.length -1;
        if(ind > 0){
            var fn = params[ind];
            var callback = function(){
                if(arguments.length && arguments[0]){
                    console.error(
                        collection._name+' - update: '+ arguments[0].reason || arguments[0].message,
                        '- arguments: ', params
                    );
                    onErrorFn(arguments[0]);
                }
                if(_.isFunction(fn)){
                    fn.apply(self, arguments);
                }
            };
            if(_.isFunction(fn)){
                params[ind] = callback;
            } else {
                params.push(callback);
            }

        }
        return _update.apply(self, params);
    };
};

/**
 * Adds error support for all inserts on client side, even if callback for update wasn't provided.
 * When update is unsuccessful function 'onErrorFn' will be called
 * @param {function=} onErrorFn (optional) If is not passed then Vazco.setErrorMessage for 'header' place will be called
 * or alert if Vazco.setErrorMessage is missing (You can override this logic by replacing UniCollection._showError)
 */
UniCollection.prototype.addErrorSupportToInserts = function(onErrorFn){
    if(Meteor.isServer){
        console.log('Default of error support for '+this._name+' cannot be applied on server side');
        return;
    }
    var _insert = this.insert;
    var collection = this;
    if(!_.isFunction(onErrorFn)){
        onErrorFn = UniCollection._showError;
    }
    this.insert = function(){
        var self = this;
        var params = _.toArray(arguments);
        var ind = params.length -1;
        if(ind > 0){
            var fn = params[ind];
            var callback = function(){
                if(arguments.length && arguments[0]){
                    console.error(
                        collection._name+' - insert: '+ arguments[0].reason || arguments[0].message,
                        '- arguments: ', params
                    );
                    onErrorFn(arguments[0]);
                }
                if(_.isFunction(fn)){
                    fn.apply(self, arguments);
                }
            };
            if(_.isFunction(fn)){
                params[ind] = callback;
            } else {
                params.push(callback);
            }

        }
        return _insert.apply(self, params);
    };
};

/**
 * Adds error support for all removes on client side, even if callback for update wasn't provided.
 * When update is unsuccessful function 'onErrorFn' will be called
 * @param {function=} onErrorFn (optional) If is not passed then Vazco.setErrorMessage for 'header' place will be called
 * or alert if Vazco.setErrorMessage is missing (You can override this logic by replacing UniCollection._showError)
 */
UniCollection.prototype.addErrorSupportToRemoves = function(onErrorFn){
    if(Meteor.isServer){
        console.log('Default of error support for '+this._name+' cannot be applied on server side');
        return;
    }
    var _remove = this.remove;
    var collection = this;
    if(!_.isFunction(onErrorFn)){
        onErrorFn = UniCollection._showError;
    }
    this.remove = function(){
        var self = this;
        var params = _.toArray(arguments);
        var ind = params.length -1;
        if(ind > 0){
            var fn = params[ind];
            var callback = function(){
                if(arguments.length && arguments[0]){
                    console.error(
                        collection._name+' - remove: '+ arguments[0].reason || arguments[0].message,
                        '- arguments: ', params
                    );
                    onErrorFn(arguments[0]);
                }
                if(_.isFunction(fn)){
                    fn.apply(self, arguments);
                }
            };
            if(_.isFunction(fn)){
                params[ind] = callback;
            } else {
                params.push(callback);
            }

        }
        return _remove.apply(self, params);
    };
};

/**
 * Adds error support for all upserts on client side, even if callback for update wasn't provided.
 * When update is unsuccessful function 'onErrorFn' will be called
 * @param {function=} onErrorFn (optional) If is not passed then Vazco.setErrorMessage for 'header' place will be called
 * or alert if Vazco.setErrorMessage is missing
 */
UniCollection.prototype.addErrorSupportToUpserts = function(onErrorFn){
    if(Meteor.isServer){
        console.log('Default of error support for '+this._name+' cannot be applied on server side');
        return;
    }
    var _upsert = this.upsert;
    var collection = this;
    if(!_.isFunction(onErrorFn)){
        onErrorFn = UniCollection._showError;
    }
    this.upsert = function(){
        var self = this;
        var params = _.toArray(arguments);
        var ind = params.length -1;
        if(ind > 0){
            var fn = params[ind];
            var callback = function(){
                if(arguments.length && arguments[0]){
                    console.error(
                        collection._name+' - upsert: '+ arguments[0].reason || arguments[0].message,
                        '- arguments: ', params
                    );
                    onErrorFn(arguments[0]);
                }
                if(_.isFunction(fn)){
                    fn.apply(self, arguments);
                }
            };
            if(_.isFunction(fn)){
                params[ind] = callback;
            } else {
                params.push(callback);
            }

        }
        return _upsert.apply(self, params);
    };
};
/**
 * Adds error callback to each one write methods
 * @see UniCollection.prototype.addErrorSupportToInserts
 * @see UniCollection.prototype.addErrorSupportToUpdates
 * @see UniCollection.prototype.addErrorSupportToUpserts
 * @see UniCollection.prototype.addErrorSupportToRemoves
 * @param {function=} onErrorFn If is not passed then Vazco.setErrorMessage for 'header' place will be called
 * or alert if Vazco.setErrorMessage is missing
 */
UniCollection.prototype.addErrorSupportToAllWriteMethods = function(onErrorFn){
    if(Meteor.isServer){
        console.log('Default of error support for '+this._name+' cannot be applied on server side');
        return;
    }
    this.addErrorSupportToInserts(onErrorFn);
    this.addErrorSupportToUpserts(onErrorFn);
    this.addErrorSupportToUpdates(onErrorFn);
    this.addErrorSupportToRemoves(onErrorFn);
};

/**
 * Adds default sort options to find,
 * but default sort option are used only when someone call find without sort options
 * @param sort
 */
UniCollection.prototype.setDefaultSort = function(sort) {
    var self = this;
    if(!self._orgFind){
        self._orgFind = self.find;
    }
    self.find = function(selector, options){
        if(!options || !options.sort){
            if(!options){
                options = {};
            }
            options.sort = sort;
        }
        return self._orgFind(selector || {}, options);
    };
};

UniCollection.prototype.getDocument = function(id){
    if(!id || !_.isString(id)){
        throw Meteor.Error(404, 'Missing id!');
    }
    var doc = this.findOne(id);
    if(!doc || !(doc instanceof UniCollection.UniDoc)){
        throw Meteor.Error(404, 'Missing entry in collection '+this._name);
    }
    return doc;
};
