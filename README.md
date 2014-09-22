Użycie:
To zmieniamy 
```
#!javascript

Colls.Books = new Mongo.Collection('Books');
```

na to
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
        this.save();
    }
};

UniBook = _.compose(UniBook, UniDoc);

Colls.Books.setBuilder(UniBook);
```

lub


```
#!javascript

Colls.Books.helpers({read: function(){
    this.isReaded = true;
     this.save();
}});
```


Możemy też tak samo dodawać na naszej pseudo kolekcji userów:
(Pisze pseudo kolekcja gdyż z tego obiektu mamy dostęp tylko do metod kolekcji userów i paru dodatkowych funkcji jak current)

```
#!javascript

UniUser = function(doc){
    doc.getName = function(){
        return doc.profile.name;
    }
};

UniUser = _.compose(UniUser, UniDoc);
Colls.Books.setBuilder(UniUser);
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

W standardzie mamy takie zabawki jak update z dokumentu, refresh danych czy np save:


```
#!javascript

var book = Colls.Books.findOne('zkkfN4Tr4Xm85fGpn');
book.title = 'Nowy T';
book.save();
```
