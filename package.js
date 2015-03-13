Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core',
    version: '1.3.2',
    git: 'https://github.com/vazco/universe-core.git'
});

Package.on_use(function (api) {
    api.versionsFrom(['METEOR@1.0']);
    api.use(['templating', 'ui', 'blaze'], 'client');
    api.use([
        'underscore@1.0.1',
        'accounts-base@1.1.2',
        'mongo'
    ], ['client', 'server']);

    api.use(['aldeed:simple-schema@1.0.3'], ['client', 'server'], {weak: true});
    api.use(['matb33:collection-hooks@0.7.9'], ['client', 'server'], {weak: true});


    api.add_files([
        'utilities/UniUtils.js',
        'utilities/UniUtilsStrings.js',
        'utilities/ProvidingGlobals.js',
        'utilities/UniConfig.js',
        'collections/UniCollection.js',
        'collections/UniDoc.js',
        'collections/UniUsers.js',
        'collections/BasicSchema.js',
        'access/UniCollectionExtension.js',
        'collections/UniSecure.js'
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
