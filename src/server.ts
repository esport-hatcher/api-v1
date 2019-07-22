// tslint:disable-next-line: no-import-side-effect
import 'module-alias/register';
import app from '@app';
import db from '@db';
import User from '@models/User';
import logger from '@utils/logger';

const executeMigration = async () => {
    const user = await User.findOne({
        where: { email: 'admin@esport-hatcher.com' },
    });
    if (!user) {
        const { BO_ADMIN_PWD } = process.env;
        await User.create({
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

db.init(process.env.NODE_ENV === 'CI' || process.env.NODE_ENV === 'prod')
    .then(() => {
        app.listen(process.env.PORT_API, () => {
            executeMigration()
                .then(() => logger('Seeders', 'Seeding successful'))
                .catch(() => logger('Seeders', 'Seeding failed'));
            logger('Server', `Executed in ${process.env.NODE_ENV} mode`);
            logger('Server', `Server listening on ${process.env.PORT_API}`);
        });
    })
    .catch((err: Error) => {
        logger('Database', `Failed to initialize database: ${err}`);
    });
