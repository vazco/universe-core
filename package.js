Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core'
});

Package.on_use(function (api) {
    api.use([
        'underscore'
    ]);

    api.add_files([
        'UniDoc.js',
        'UniUser.js'
    ]);

    api.export([
        'UniDoc',
        'UniUser'
    ]);
});