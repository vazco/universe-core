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

# Quickly about Universe Access & Mappings

```
UniCollection.publish('example', function() {
    this.setMappings(Colls.MyColl, [
        //Map a value of organisationsIds from selected documents of Colls.MyColl to document from Colls.Rooms
        {
            key: 'organisationsIds',
            collection: Colls.Rooms
        }
    ]);
    return Colls.MyColl.find();
});

Colls.MyColl.allow({
    insert: function (userId){
        return true;
    },
    update: function (userId, doc, fieldNames){
        return true;
    },
    remove: function (userId, doc){
        return true;
    },
    publish: function(userId, doc, publicationName){
        return true;
    }
});
```

### Information about access control you can find here: [UniCollection.publish](access/README.md)

### Information about utilities you can find here: [UniUtils](utilities/README.md)


## Documents Methods

You can use Collection.helpers method to register new methods to objects.

```
#!javascript

Colls.Books = new UniCollection('Books');

//Adding methods to documents
Colls.Books.helpers({
    read: function(){
        this.isReaded = true;
        this.save('isReaded');
    }
});

var book = Colls.Books.findOne();
//All documents will be have before defined functions
book.read();
```

### Users

Universe-core provides UniUsers object which is a copy of Meteor.users collection object that shares the same document with. It is just a simple hack to make sure that Meteor.users collection stay unmodiefied. Both operates on the same documents, only methods to access objects have changed.

## Default Methods on Documents

Default methods for all UniCollections documents (including UniUsers):

```doc.update(modifier, options, cb)``` - performs update on current document.

```doc.remove(cb)``` - removes current document.

```doc.findSelf()``` - returns current document from database. Useful for tracking reactive changes.

```doc.getCollection()``` - returns collection to which current document belongs.



