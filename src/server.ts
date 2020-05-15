// tslint:disable-next-line: no-import-side-effect
import 'module-alias/register';
import { app } from '@app';
import { sequelizeDb } from '@db';
import { User, Role, Team } from '@models';
import { logger } from '@utils';

const executeMigration = async () => {
    // To replace with a true migration system
    const { BO_ADMIN_PWD } = process.env;
    await User.findCreateFind({
        where: {
            firstName: 'admin',
            lastName: 'admin',
            username: 'admin',
            password: BO_ADMIN_PWD,
            email: 'admin@esport-hatcher.com',
            superAdmin: true,
            country: 'France',
            city: 'Paris',
            phoneNumber: '3300000000',
        },
    }).then(async userResult => {
        await Team.findCreateFind({
            where: {
                name: 'Esport-Hatcher',
                game: 'League of Legends',
                region: 'EUW',
                avatarTeamUrl: 'https://google.com',
                bannerUrl: 'https://google.com',
            },
        }).then(teamResult => {
            teamResult[0].addUser(userResult[0], {
                through: {
                    role: 'Owner',
                    playerStatus: true,
                    teamStatus: true,
                },
            });
        });
    });

    /**
     * Permissions
     * ---
     * Roles
     */

    await Role.findCreateFind({
        where: {
            name: 'Owner',
            primary: true,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'Administrator',
            primary: true,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'Staff',
            primary: true,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'Player',
            primary: true,
        },
    });
};

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
