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

