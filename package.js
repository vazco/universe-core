Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core'
});

Package.on_use(function (api) {
    api.use([
        'underscore',
        'aldeed:simple-schema'
    ], ['client', 'server']);

    api.use(['matb33:collection-hooks'], ['client', 'server'], {weak: true});

    api.add_files([
        'UniDoc.js',
        'UniCollection.js',
        'UniUser.js'
    ],  ['client', 'server']);

    api.export([
        'UniCollection',
        'UniDocBuilder',
        'UniUserBuilder',
        'UniUsers'
    ],  ['client', 'server']);
});