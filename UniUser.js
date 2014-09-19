UniUser = UniDoc.extend({
    collection: Meteor.users,
    current: function () {
        return this.findOne(Meteor.userId());
    }
}, {
    getName: function () {
        return this.profile.name;
    }
});