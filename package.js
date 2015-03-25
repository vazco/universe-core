Package.describe({
    summary: 'Contains collection on steroids. ( Access / DocHelpers / User Helpers ) Many awesome utilities',
    name: 'vazco:universe-core',
    version: '1.5.0',
    git: 'https://github.com/vazco/universe-core.git'
});

Package.on_use(function (api) {
    api.versionsFrom(['METEOR@1.0']);
    api.use(['templating', 'ui', 'blaze'], 'client');
    api.use([
        'underscore@1.0.3',
        'accounts-base@1.1.2',
        'mongo'
    ], ['client', 'server']);

    api.use(['matb33:collection-hooks@0.7.11'], ['client', 'server'], {weak: true});


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
        'UniUsers',
        'Vazco',
        'Colls',
        'App'

    ],  ['client', 'server']);
});
