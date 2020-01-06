// tslint:disable-next-line: no-import-side-effect
import 'module-alias/register';
import { app } from '@app';
import { sequelizeDb } from '@db';
import { User } from '@models';
import { logger } from '@utils';

const executeMigration = async () => {
    const user = await User.findOne({
        where: { email: 'admin@esport-hatcher.com' },
    });
    if (!user) {
        const { BO_ADMIN_PWD } = process.env;
        await User.create({
            firstName: 'admin',
            lastName: 'admin',
            username: 'admin',
            password: BO_ADMIN_PWD,
            email: 'admin@esport-hatcher.com',
            superAdmin: true,
            country: 'France',
            city: 'Paris',
            phoneNumber: '3300000000',
        });
    }
};

sequelizeDb
    .init(
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
