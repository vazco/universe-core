Universe collections

Colls.Books = new UniCollection('Books');

UniBook = function(doc){
    doc.read = function(){
        this.isReaded = true;
    }
    return doc;
};

UniBook = _.compose(UniBook, UniDoc);

Colls.Books.setDoc(UniBook);

or

Colls.Books.helpers({read: function(){
    this.isReaded = true;
}});

You can also use it on our pseudo collection of users

UniUsers.helpers({getName: function(){
   return this.profile.name;
}});


///////////////Robocza wersja tz. kopia z pull requesta/////////////
Użycie:
To zmieniamy 
```
#!javascript

Colls.Books = new Mongo.Collection('Books');
```

na
```
#!javascript

 Colls.Books = new UniCollection('Books');
```

Rozszerzanie standardowego dokumentu:


```
#!javascript

UniBook = function(doc){
    doc.read = function(){
        this.isReaded = true;
    }
    return doc;
};

UniBook = _.compose(UniBook, UniDoc);

Colls.Books.setDoc(UniBook);
```

lub


```
#!javascript

Colls.Books.helpers({read: function(){
    this.isReaded = true;
}});
```


Możemy też tak samo dodawać to na naszej pseudo kolekcji userów:

```
#!javascript

UniUser = function(doc){
    doc.getName = function(){
        return doc.profile.name;
    }
    return doc;
};

UniUser = _.compose(UniUser, UniDoc);
Colls.Books.setDoc(UniUser);
```

lub

```
#!javascript

UniUsers.helpers({getName: function(){
   return this.profile.name;
}});
```
Potem mamy:

```
#!javascript

Colls.Books.findOne().read();
```

czy:

```
#!javascript

UniUsers.findOne().getName();
```

W standardzie mamy takie zabawki jak update z dokumentu czy np save:


```
#!javascript

var book = Colls.Books.findOne('zkkfN4Tr4Xm85fGpn');
book.title = 'Nowy T';
book.save();
```

