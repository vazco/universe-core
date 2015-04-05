Package.describe({
    summary: 'Contains collection on steroids. ( access / doc helpers / user helpers ) Many awesome utilities',
    name: 'vazco:universe-core',
    version: '1.6.7',
    git: 'https://github.com/vazco/universe-core.git'
});

Package.on_use(function (api) {
    api.versionsFrom(['METEOR@1.0.4']);
    var implyPackages = [
        'vazco:universe-utilities@1.0.6',
        'vazco:universe-collection@1.1.0',
        'vazco:universe-access@1.1.3'
    ];
    api.use(implyPackages);
    api.imply(implyPackages);
});
