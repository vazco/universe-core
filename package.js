Package.describe({
    summary: 'Contains collection on steroids. ( access / doc helpers / user helpers ) Many awesome utilities',
    name: 'vazco:universe-core',
    version: '1.6.8',
    git: 'https://github.com/vazco/universe-core.git'
});

Package.onUse(function (api) {
    api.versionsFrom(['METEOR@1.0.4']);
    var implyPackages = [
        'universe:utilities',
        'universe:utilities-blaze',
        'universe:collection'
    ];
    api.use(implyPackages);
    api.addFiles('deprecated.js');
    api.imply(implyPackages);
    api.export('Vazco');
    api.export('App');
    api.export('Colls');
});
