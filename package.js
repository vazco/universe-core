Package.describe({
    summary: 'Contains collection on steroids. ( access / doc helpers / user helpers ) Many awesome utilities',
    name: 'vazco:universe-core',
    version: '1.6.0',
    git: 'https://github.com/vazco/universe-core.git'
});

Package.on_use(function (api) {
    api.versionsFrom(['METEOR@1.0.4']);
    var implyPackages = [
        'vazco:universe-utilities@1.0.2',
        'vazco:universe-collection@1.0.0',
        'vazco:universe-access@1.0.0'
    ];
    api.use(implyPackages);
    api.imply(implyPackages);
});
