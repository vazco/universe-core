Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core',
    version: '1.1.0',
    git: 'https://github.com/vazco/universe-core.git'
});

Package.on_use(function (api) {
    api.versionsFrom(['METEOR@1.0']);
    api.use(['templating', 'ui', 'blaze'], 'client');
    api.use([
        'underscore@1.0.1',
        'accounts-base@1.1.2',
        'aldeed:simple-schema@1.0.3'
    ], ['client', 'server']);

    api.use(['matb33:collection-hooks'], ['client', 'server'], {weak: true});

    api.add_files([
        'utilities/UniUtils.js',
        'utilities/ProvidingGlobals.js',
        'utilities/UniConfig.js',
        'collections/UniDoc.js',
        'collections/UniCollection.js',
        'collections/UniUser.js',
        'collections/BasicSchema.js'
    ]);

    api.add_files(['utilities/SpacebarsHelpers.js'],['client']);

    api.export([
        'UniUtils',
        'UniConfig',
        'UniCollection',
        'UniDoc',
        'UniUsers',
        'UniUser',
        'Vazco',
        'Colls',
        'App'

    ],  ['client', 'server']);
});