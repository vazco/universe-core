Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core'
});

Package.on_use(function (api) {
    api.use([
        'underscore',
        'aldeed:simple-schema'
    ], ['client', 'server']);

    api.add_files([
        'UniDoc.js',
        'UniCollection.js',
        'UniUser.js'
    ]);

    api.export([
        'UniCollection',
        'UniDoc',
        'UniUsers'
    ]);
});