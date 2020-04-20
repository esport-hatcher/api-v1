// tslint:disable-next-line: no-import-side-effect
import 'module-alias/register';
import { app } from '@app';
import { sequelizeDb } from '@db';
import { User, Role, Team } from '@models';
import { logger } from '@utils';

const executeMigration = async () => {
    // To replace with a true migration system
    const user = await User.findOne({
        where: { email: 'admin@esport-hatcher.com' },
    });

    if (!user) {
        const { BO_ADMIN_PWD } = process.env;
        const newUser = await User.create({
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

        const team = await Team.findOne({
            where: { name: 'Esport-Hatcher' },
        });
        if (!team) {
            const newTeam = await Team.create({
                name: 'Esport-Hatcher',
                game: 'League of Legends',
                region: 'EUW',
                avatarTeamUrl: 'https://google.com',
                bannerUrl: 'https://google.com',
            });

            newTeam.addUser(newUser);
        }
    }

    /**
     * Permissions
     * ---
     * Roles
     */
    let role = await Role.findOne({
        where: { name: 'Owner' },
    });
    if (!role) {
        await Role.create({
            name: 'Owner',
            primary: true,
        });
    }

    role = await Role.findOne({
        where: { name: 'Administrator' },
    });
    if (!role) {
        await Role.create({
            name: 'Administrator',
            primary: true,
        });
    }

    role = await Role.findOne({
        where: { name: 'Staff' },
    });
    if (!role) {
        await Role.create({
            name: 'Staff',
            primary: true,
        });
    }

    role = await Role.findOne({
        where: { name: 'Player' },
    });
    if (!role) {
        await Role.create({
            name: 'Player',
            primary: true,
        });
    }
};

sequelizeDb
    .init(
        true ||
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
