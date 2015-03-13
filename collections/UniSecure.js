'use strict';

UniUsers.getRestrictedFields = function(){
    return ['is_Admin', 'permissions', '_id'];
};

var _checkIfContainsRestrictedFields = function(fieldNames){
    var foundFields = _.intersection(UniUsers.getRestrictedFields(), fieldNames);
    if(_.isArray(foundFields) && foundFields.length){
        return true;
    }
    return false;
};

UniUsers.deny({
    update: function (userId, doc, fieldNames) {
        var user = UniUtils.getUniUserObject(userId, false);
        if(!UniUsers.hasDocument(user) || !user.isAdmin()){
            return _checkIfContainsRestrictedFields(fieldNames);
        }
    }
});