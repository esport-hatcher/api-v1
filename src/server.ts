// tslint:disable-next-line: no-import-side-effect
import 'module-alias/register';
import { app } from '@app';
import { sequelizeDb } from '@db';
import { logger } from '@utils';

sequelizeDb
    .init(
        process.env.NODE_ENV === 'CI' ||
            process.env.NODE_ENV === 'production' ||
            process.env.NODE_ENV === 'staging'
    )
    .then(() => {
        app.listen(process.env.PORT_API, () => {
            logger('Server', `Executed in ${process.env.NODE_ENV} mode`);
            logger('Server', `Server listening on ${process.env.PORT_API}`);
        });
    })
    .catch((err: Error) => {
        logger('Database', `Failed to initialize database: ${err}`);
    });
