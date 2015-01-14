Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core',
    version: "0.9.5",
    git: "https://github.com/vazco/universe-core.git"
});

Package.on_use(function (api) {
    api.use([
        'underscore',
        'accounts-base',
        'aldeed:simple-schema@1.1.0'
    ], ['client', 'server']);

    api.versionsFrom(['METEOR@0.9.3', 'METEOR@0.9.4', 'METEOR@1.0']);

    api.use(['matb33:collection-hooks@0.7.7'], ['client', 'server'], {weak: true});

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