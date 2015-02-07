'use strict';
/* global UniConfig: true */
var _configCollection = new Meteor.Collection('universe_configs');
UniConfig = {
    public:{
        set: function(name, value, isServerWriteOnly){
            if(_.isUndefined(value)){
                return !!_configCollection.remove({name: name, access: 'public'});
            }
            var row = {name: name, value:value, access: 'public', lastModified: new Date()};

            if(isServerWriteOnly){
                row.isServerWriteOnly = isServerWriteOnly;
            }
            return !!_configCollection.upsert(
                {name: name, access: 'public'},
                row
            );
        },
        get: function(name, defaultValue){
            var obj = _configCollection.findOne({name: name, access: 'public'});
            if(_.isUndefined(obj)) {
                return defaultValue;
            }
            return obj.value;
        },
        getRow: function(name){
           return _configCollection.findOne({name: name, access: 'public'});
        }
    },
    users: {
        set: function(name, value, userId){
            if(!userId){
                userId = Meteor.userId();
            }
            userId = UniUtils.getIdIfDocument(userId);
            if(!userId){
                throw Meteor.Error(404, 'Missing userId');
            }
            if(_.isUndefined(value)){
                return !!_configCollection.remove({name: name, access: userId});
            }
            return !!_configCollection.upsert(
                {name: name, access: userId},
                {name: name, value:value, access: userId, lastModified: new Date()}
            );
        },
        get: function(name, defaultValue, userId){
            if(!userId){
                userId = Meteor.userId();
            }
            userId = UniUtils.getIdIfDocument(userId);
            if(!userId){
                throw Meteor.Error(404, 'Missing userId');
            }
            var obj = _configCollection.findOne({name: name, access: userId});
            if(_.isUndefined(obj)) {
                return defaultValue;
            }
            return obj.value;
        },
        getRow: function(name){
            return _configCollection.findOne({name: name, access: 'public'});
        }
    }
};

if(Meteor.isServer){
    UniConfig.private = {
        set: function (name, value) {
            if (_.isUndefined(value)) {
                return !!_configCollection.remove({name: name, access: 'private'});
            }
            return !!_configCollection.upsert(
                {name: name, access: 'private'},
                {name: name, value: value, access: 'private', lastModified: new Date()}
            );
        },
        get: function (name, defaultValue) {
            var obj = _configCollection.findOne({name: name, access: 'private'});
            if (_.isUndefined(obj)) {
                return defaultValue;
            }
            return obj.value;
        },
        getRow: function(name){
            return _configCollection.findOne({name: name, access: 'public'});
        }
    };

    Meteor.publish(null, function () {
        var query = {access: 'public'};
        if(_.isString(this.userId) && this.userId !== 'private'){
            query = {$or:[query, {access: this.userId}]};
        }
        return _configCollection.find(query);
    });
    _configCollection._ensureIndex({name:1, access:1}, {unique: 1});

    var _checkRights = function(userId, doc){
        if(doc.isServerWriteOnly){
            return false;
        }
        switch(doc.access){
            case 'public':
                return true;
            case 'private':
                return false;
        }
        return doc.access === userId;
    };

    _configCollection.allow({
        insert: _checkRights,
        update: _checkRights,
        remove: _checkRights
    });
}
