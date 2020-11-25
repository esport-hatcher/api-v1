var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var chalk = require('chalk');

module.exports = {
    create: function (config, adapter) {
        return adapter.createDatabase(config.db).then(function () {
            return adapter;
        });
    },

    drop: function (config, adapter) {
        return adapter.dropDatabase(config.db).then(function () {
            return adapter;
        });
    },

    generate: function (config, logger, migrationName) {
        var up,
            down,
            ts = Date.now();

        if (typeof config.migrationsDir !== 'string') {
            throw new Error('configuration "migrationsDir" is missing');
        }

        mkdirp.sync(config.migrationsDir);

        up = ts + '_up_' + migrationName + '.sql';
        down = ts + '_down_' + migrationName + '.sql';

        up = path.resolve(config.migrationsDir, up);
        down = path.resolve(config.migrationsDir, down);

        logger.log(up);
        logger.log(down);

        fs.openSync(up, 'w');
        fs.openSync(down, 'w');
    },

    rollback: function (migrationProvider, adapter, logger) {
        return adapter.appliedMigrations().then(function (ids) {
            var lastAppliedMigrationId = ids[ids.length - 1];

            if (!lastAppliedMigrationId) {
                logger.log('Nothing to rollback');
                return;
            }

            var migration = migrationProvider
                .getMigrationsList()
                .find(function (migration) {
                    var baseName = migration.match(/^(\d+)_down/);
                    if (baseName && baseName[1] == lastAppliedMigrationId) {
                        return true;
                    }
                    return false;
                });

            if (!migration) {
                throw new Error(
                    "Can't find migration with id ",
                    lastAppliedMigrationId
                );
            }

            var sql = migrationProvider.getSql(migration);
            return adapter.rollbackMigration(migration, sql);
        });
    },

    migrate: function (migrationProvider, adapter, minMigrationTime, logger) {
        return adapter.appliedMigrations().then(function (appliedMigrationIds) {
            var migrationsList = migrationProvider.getMigrationsList();
            var pending = getPending(
                migrationsList,
                appliedMigrationIds,
                minMigrationTime
            );

            if (pending.length === 0) {
                logger.log('No pending migrations');
                return;
            }

            logger.log('Pending migrations:');
            pending.forEach(function (m) {
                logger.log(chalk.green('>>'), m);
            });

            var migration;
            var migrationProgress = Promise.resolve();
            while ((migration = pending.shift())) {
                (function (migration) {
                    migrationProgress = migrationProgress.then(function () {
                        var sql = migrationProvider.getSql(migration);
                        return adapter.applyMigration(migration, sql);
                    });
                })(migration);
            }
            return migrationProgress;
        });
    },
};

function getPending(migrationsList, appliedMigrationIds, minMigrationTime) {
    var pending = [];
    console.log(migrationsList);
    console.log('========================');
    console.log(appliedMigrationIds);
    migrationsList.forEach(function (migration) {
        var id = migration.match(/^(\d+)/)[0];
        if (
            !appliedMigrationIds.indexOf(id) &&
            migration.match(/^\d+\_up.*$/)
        ) {
            pending.push(migration);
        }
    });

    return pending;
}
