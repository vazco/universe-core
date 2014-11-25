#Universe Core

## About

Universe Core is package providing simple database mapping. It is extending plain JS objects by adding common methods used in all projects.

## How to use

### Creating collection
Instead of using standard:
```
#!javascript

Colls.Books = new Mongo.Collection('Books');
```

use this:
```
#!javascript

 Colls.Books = new UniCollection('Books');
```

###Basic use

You can use Collection.helpers method to register new methods to objects.

```
#!javascript

Colls.Books = new UniCollection('Books');

Colls.Books.helpers({
    read: function(){
        this.isReaded = true;
        this.save();
    }
});
```

###Users

Universe-core provides UniUsers object which is a copy of Meteor.users collection object that shares the same document with. It is just a simple hack to make sure that Meteor.users collection stay unmodiefied. Both operates on the same documents, only methods to access objects have changed.

##API

Default methods for all UniCollections documets (including UniUsers):

```doc.update(modifier, options, cb)``` - performs update on current document.

```doc.remove(cb)``` - removes current document.

```doc.findMe()``` - returns current document from database. Useful for tracking reactive changes.

