## Plugin creation tutorial

**Check universe-news and universe-chat (and add-ons to them) for example.**

**This is still bugged but it is mostly simple to debug stuff.**

1. Create new meteor package.

2. In package.js add 

```
Package.describe({
    summary: "My awesome plugin!"
});

Package.on_use(function (api) {
    // this is important part
    api.use(['universe-core']);
});

```
Now lets create some js files. My package gonna provide some ultra useful features like outputting animal noises on javascript console, so let's called it UniAnimals.

```
UniAnimals = new Uni.Plugin('UniAnimals', {
    path: '/muu'
});

```

What about path? This will be your default path for plugin. All routers gonna prefix this in their paths. If you want to create route with absolute path, just start your router path with **/** (like in unix). We are also considering adding c:/ option for Windows users.

Now lets add some collections. My livestock oriented plugin gonna need some Cows, Horses and Chickens.
```
UniAnimals.addCollection('UniAnimalsCows');
UniAnimals.addCollection('UniAnimalsHorses');
UniAnimals.addCollection('UniAnimalsChickens');
```

You can access them using prefixed global **UniAnimalsCows** or by **UniAnimals.Cows**.

Let's overview other plugin methods:

```
UniAnimals.addMethod('milkAllCows', function(){
    console.log('muuu!');
});

// equivalent of Meteor.method({UniAnimalsMilkAllCows:  function(){...});



UniAnimals.addPath('horsesInStable', {
    path: '/horses/:_id',
    template: 'horseList'
});

// equivalent of Router.map(function () {
//  this.route('UniAnimalsHorsesInStable', {..});
// }



UniAnimals.addPublication('chickens', function(){
    return UniAnimalsChickens.find();
});

// equivalent of Meteor.publish('UniAnimalsChickens',  function(){...}
```

There is slight difference with helpers and events:

```
UniAnimals.addEvent('horseList', 'click .horse', function(e){
    console.log('horse is not pleased');
});

// equivalent of Template.UniAnimalsHorseList.events({
//    'click .horse': function(e){...}
//});


UniAnimals.addHelper('horseList', 'horseName', function(){
    return 'Andrzej';
});

// equivalent of Template.UniAnimalsHorseList.horseName = function(){...};
```

Beside add method there is also remove and get. So you can do something like this (in project or in package that modify your original plugin):
```
var horseRoute = UniAnimals.getRoute('horseList');
horseRoute.path = '/ponies/:_id';
horseRoute.template = 'ponyList'

UniAnimals.removeCollection('chickens');
UniAnimals.addCollection('dolphins');
```

###Templates

Templates are slightly more complicated. You basically make templates like always, but you must add prefix yourself:

```
<template name="UniAnimalsHorseList">
    {{#each horses}}
        <p> I'am a horse </p>
    {{/each}}
</template>
```

Now if you want to override your template with this:
```
<template name="UniAnimalsPonyList">
    {{#each ponies}}
        <p> I'am a pony </p>
    {{/each}}
</template>
```
Use this function without prefixes:
```
UniAnimals.setTemplate('horseList', 'ponyList');
```

###Ok, what now?

If you finished writing your plugin, your extension to your plugin or you finished modifying it in project, just put this inside your project:

```
Uni.init();
```

###Classes

Let's start with example:

```
// methods inheritance:
Uni.Class.Animal = Uni.Class.Object.extend({
    howManyLegs: function (){
        return this.legsCount;
    }
});

// simpleSchema inheritance:
Uni.Class.Animal.schema = new SimpleSchema([
    Uni.Class.Object.schema, // <- this is our base schema
    
    // below are the new, animal specific fields.
    {
        legsCount: {
            type: Number,
            max: 8, // spiders are alright but no crabs
            min: 2
        }
    }
]);
```

Now we got basic animal class like structure. We use simpleSchema to define fields and prototype inheritance to add some methods. 

Lets inherit some more and actually add it to our plugin.

```
Uni.Class.Cow = Uni.Class.Animal.extend({
    sayMuu: function (){
        console.log('muu');
    },
    isDangerous: function (){
        if(this.horns){
            console.log('yep');
        }
    }
});

Uni.Class.Cow.schema = new SimpleSchema([
    Uni.Class.Animal.schema, // <- this is our base animal schema
    {
        horns: {
            type: Boolean
        }
    }
]);

// Let's remove old boring cows
UniAnimals.removeCollection('cows');

// And add our new cows with horns and stuff.
UniAnimals.addCollection('cows',{
    constructor: Uni.Class.Cow,
    schema: Uni.Class.Cow.schema // <- this is optional if constructor is set
});
```

###Relations

To be continued...

