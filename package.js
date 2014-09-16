Package.describe({
    summary: 'Universe CMS Core package',
    name: 'vazco:universe-core'
});

Package.on_use(function (api) {
    api.use([
        'underscore',
        'aldeed:collection2',
        'ejson'
    ]);

    api.add_files([
        'Universe.js',
        'UniId.js',
        'Doc.js',
        'Col.js',
        'collections.js',
        'docMethods.js',
        'relations.js',
        'utils.js',
        'wrappers.js'
    ]);

    api.export([
        'Uni'
    ]);
});