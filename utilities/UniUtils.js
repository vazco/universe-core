'use strict';

/* global UniUtils: true */

UniUtils = {
    /**
     * Creates an empty object inside namespace if not existent.
     * @param object
     * @param {String} path
     * @param {*} value in path. default is object if no matches in path
     * @example var obj = {};
     * set(obj, 'foo.bar'); // {}
     * console.log(obj);  // {foo:{bar:{}}}
     * @returns {*} it'll return created object or existing object.
     */
    set: function (object, path, value) {
        if (!_.isString(path)) {
            console.log('Path must be type of String', 'error');
            return object;
        }
        var obj = object;
        _.each(path.split('.'), function (key, index, list) {
            if (!obj[key]) {
                obj[key] = {};
            }
            if (!_.isUndefined(value) && list.length === (index + 1)) {
                obj[key] = value;
            }
            obj = obj[key];
        });
        return object;
    },

    /**
     * Returns nested property value.
     * @param obj
     * @param prop
     * @example var obj = {
        foo : {
            bar : 11
        }
    };

     get(obj, 'foo.bar'); // "11"
     get(obj, 'ipsum.dolorem.sit');  // undefined
     * @returns {*} found property or undefined if property doesn't exist.
     */
    get: function (obj, prop) {
        if (!_.isObject(obj)) {
            throw new Error('Parameter object must be type of Object');
        }
        if (!_.isString(prop)) {
            throw new Error('Parameter prop must be type of String');
        }
        var parts = prop.split('.');
        var last;

        if (_.isArray(parts)) {
            last = parts.pop();
        } else {
            if (_.has(obj, prop)) {
                return obj[prop];
            } else {
                return;
            }
        }

        while (prop = parts.shift()) {
            obj = obj[prop];
            if (typeof obj !== 'object' || obj === null) {
                return;
            }
        }

        return (obj && obj[last] ? obj[last] : undefined);
    },

    /**
     * Checks if object contains a child property.
     * Useful for cases where you need to check if an object contain a nested property.
     * @param obj
     * @param prop
     * @returns {boolean}
     */
    has: function (obj, prop) {
        return _.isObject(obj) && !_.isUndefined(UniUtils.get(obj, prop));
    },


    /**
     * Search key in object or array
     * @param obj or array
     * @param search predicate function or value
     * @param context
     */
    findKey: function (obj, search, context) {
        var result,
            isFunction = _.isFunction(search);

        _.any(obj, function (value, key) {
            var match = isFunction ? search.call(context, value, key, obj) : (value === search);
            if (match) {
                result = key;
                return true;
            }
        });
        return result;
    },
    getIdIfDocument: function (docId) {
        if (_.isObject(docId)) {
            return docId._id;
        }
        return docId;
    },
    getUniUserObject: function (user, doNotGetLoggedIn) {
        if (!user) {
            if (doNotGetLoggedIn) {
                return null;
            } else {
                user = UniUsers.getLoggedIn();
            }
        } else if (_.isString(user)) {
            user = UniUsers.findOne(user);
        } else if (_.isObject(user) && !user.getCollection) {
            //if user object isn't universe document
            user = UniUsers.findOne(user._id);
        }
        return user;
    },
    /**
     * Gets instance parent of current template it works everywhere where Template.instance() works
     * @param {string} templateName Name of template
     * @param {object=TemplateInstance} templateName Name of template
     */
    getParentTemplateInstance: function (templateName, currentTemplateInstance) {
        if (!/Template\..*/i.test(templateName)) {
            templateName = 'Template.' + templateName;
        }
        if (!currentTemplateInstance) {
            currentTemplateInstance = Template.instance();
        }
        var view = Template.instance().view;
        while (view && view.name !== templateName) {
            view = view.parentView;
        }
        return view && view.templateInstance();
    },

    /**
     * Gets instance of template by DOM element
     * useful when you need a template instance which is not your parent template
     * @param domElem DOM element (not jQuery obj)
     */
    getTemplateInstanceByDOM: function (domElem) {
        if (domElem) {
            var view = Blaze.getView(domElem);
            return view && view.templateInstance();
        }
    }
};

