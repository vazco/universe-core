Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core',
    version: '0.9.2',
    git: 'https://github.com/vazco/universe-core.git'
});

Package.on_use(function (api) {
    api.use([
        'underscore@1.0.1',
        'accounts-base@1.1.2',
        'aldeed:simple-schema'
    ], ['client', 'server']);

    api.use(['matb33:collection-hooks'], ['client', 'server'], {weak: true});

    api.add_files([
        'UniDoc.js',
        'UniCollection.js',
        'UniUser.js',
    ],  ['client', 'server']);

    api.export([
        'UniCollection',
        'UniDoc',
        'UniUser',
        'UniUsers'
    ],  ['client', 'server']);
});