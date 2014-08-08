'use strict';

Uni.cols = {};

Uni.Col = function (collection, relations) {
    this.collection = collection;
    this._relations = this.relations(relations);
};

Uni.Col.prototype.relations = function () {
    // tu byłaby metoda ktora przechodzi
    // przez wszystki instancje Col i
    // dopisuje relacje w drugą strone
    // (relacje jedno stronne też, ale z
    // adnotacją)
};

/*
 Propozycja schematu
 */
var SomeCollection;
var UniColMock = new Uni.Col(
    SomeCollection,
    {
        relation1: {
            collections: ['UniUsers', 'UniEvents'],
            mutual: true // defaultowo na false
        },
        relation2: {
            collections: 'UniChat'

        },
        relation3: {
            collections: 'UniRole',
            mandatory: true
        }
    }
);

/*
 Propozycja metod
 */

// Dodajemy dokumenty do kolecji wraz z relacjąmi do relatedTo.
// docs jest pojedynczym dokumentem lub [document]

// relatedTo jest kontenerem identyfikujacym dokumenty. Jedno z:
// _id, [_id], Doc, [Doc], UniId, [UniId].

// collection jest opcjonalne jesli relacja jest z jedną kolekcja.
// jesli relacja jest z wieloma kolekcjami, relatedTo nie moze byc
// _id ani [_id]
Uni.Col.prototype.insertRelated = function(docs, relatedTo, relationName, collection){};

// Tak jak insertRelated tyko operuje na istniejących
// docs jest tego samego typu co relatedTo czyli:
// _id, [_id], Doc, [Doc], UniId, [UniId].
Uni.Col.prototype.addRelation = function(docs, relatedTo, relationName, collection){};

// Usuwamy dokument oraz kierujace do niego relacje.
Uni.Col.prototype.removeDocAndRelated = function(id){};

// Updatujemy wszystkie documenty w relacji relationName z dokumentami z docs.
Uni.Col.prototype.updateRelated = function(docs, relationName, modifier,collection){};