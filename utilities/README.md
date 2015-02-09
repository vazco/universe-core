#Utilities

This package provides variables: 
### UniUtils
- contains helpers methods (between projects), 

### App
- space for application helpers and other stuff, 

### Colls
- space for collections in project

UniUtils.set - Creates an empty object inside namespace if not existent.

UniUtils.get - Returns nested property value.
```
@param obj
@param prop
@example var obj = {
        foo : {
            bar : 11
        }
    };

 get(obj, 'foo.bar'); // "11"
 get(obj, 'ipsum.dolorem.sit');  // undefined
@returns {*} found property or undefined if property doesn't exist.
```
UniUtils.has - Checks if object contains a child property.
Useful for cases where you need to check if an object contain a nested property.

UniUtils.findKey - Search key in object or array
```
@param obj or array
@param search predicate function or value
@param context
```

UniUtils.getParentTemplateInstance - Gets instance parent of current template it works everywhere where Template.instance() works
```
@param {string} templateName Name of template
```

##And many more - check the source##