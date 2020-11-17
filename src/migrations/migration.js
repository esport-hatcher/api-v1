var MigrationProvider = require('./migration-provider');
var MigrationActions = require('./migration-actions');

var LOGGER = console;

function migrate(config, adapter) {
    var migrationProvider = MigrationProvider(config);
    return MigrationActions.migrate(
        migrationProvider,
        adapter,
        config.minMigrationTime,
        LOGGER
    ).then(
        function () {
            return adapter.dispose();
        },
        function (error) {
            function rethrowOriginalError() {
                throw error;
            }
            return adapter
                .dispose()
                .then(rethrowOriginalError, rethrowOriginalError);
        }
    );
}

function rollback(config, adapter) {
    var migrationProvider = MigrationProvider(config);
    return MigrationActions.rollback(migrationProvider, adapter, LOGGER).then(
        function () {
            return adapter.dispose();
        },
        function (error) {
            function rethrowOriginalError() {
                throw error;
            }
            return adapter
                .dispose()
                .then(rethrowOriginalError, rethrowOriginalError);
        }
    );
}

module.exports = {
    setLogger: function (logger) {
        LOGGER = logger;
    },
    migrate: migrate,
    rollback: rollback,
    run: function (config) {
        var Adapter = require('./mysql-adapter');
        var adapter = Adapter(config, LOGGER);

        var args = process.argv.slice(2);

        switch (args[0]) {
            case 'create':
                MigrationActions.create(config, adapter);
                break;
            case 'drop':
                MigrationActions.drop(config, adapter);
                break;
            case 'generate':
                MigrationActions.generate(config, LOGGER, args[1]);
                break;
            case 'migrate':
                migrate(config, adapter).then(onCliSuccess, onCliError);
                break;
            case 'rollback':
                rollback(config, adapter).then(onCliSuccess, onCliError);
                break;
            default:
                LOGGER.log('exit');
        }

        function onCliSuccess() {
            LOGGER.log('done');
            process.exit();
        }

        function onCliError(error) {
            LOGGER.error('ERROR:', error);
            process.exit(1);
        }
    },
};
