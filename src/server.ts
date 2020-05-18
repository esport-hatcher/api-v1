// tslint:disable-next-line: no-import-side-effect
import 'module-alias/register';
import { app } from '@app';
import { sequelizeDb } from '@db';
import { logger, registerActions } from '@utils';
import { migrateUsers, migrateRoles, migratePermissions } from '@migrations';

const executeMigration = async () => {
    // Possible improvements to be applied but folder structure is somehow done.
    // Migration system halfway to be something flexible and useful.
    registerActions(app);

    await migrateUsers();
    await migrateRoles();
    await migratePermissions();
};

const initSequelize = async (): Promise<void> => {
    sequelizeDb
        .init(
            //true ||
            process.env.NODE_ENV === 'CI' ||
                process.env.NODE_ENV === 'production' ||
                process.env.NODE_ENV === 'staging'
        )
        .then(() => {
            app.listen(process.env.PORT_API, () => {
                executeMigration()
                    .then(() => logger('Seeders', 'Seeding successful'))
                    .catch((err: Error) => {
                        logger('Seeders', 'Seeding failed');
                        logger('Seeders', `${err}`);
                    });
                logger('Server', `Executed in ${process.env.NODE_ENV} mode`);
                logger('Server', `Server listening on ${process.env.PORT_API}`);
            });
        })
        .catch((err: Error) => {
            logger('Database', `Failed to initialize database: ${err}`);
        });

    return null;
};

const entryPoint = async (): Promise<void> => {
    await initSequelize();
};

entryPoint().catch(err => {
    logger('Server', err);
});
