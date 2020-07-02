import { User, Team, Role, RoleUser } from '@models';

export const migrateUsers = async (): Promise<void> => {
    const { BO_ADMIN_PWD } = process.env;
    await User.findCreateFind({
        where: {
            firstName: 'admin',
            lastName: 'admin',
            username: 'admin',
            email: 'admin@esport-hatcher.com',
            superAdmin: true,
            country: 'France',
            city: 'Paris',
            phoneNumber: '3300000000',
        },
        defaults: {
            password: BO_ADMIN_PWD,
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
        }).then(async teamResult => {
            const teamUsers: Array<User> = await teamResult[0].getUsers();

            if (!teamUsers.includes(userResult[0])) {
                teamResult[0].addUser(userResult[0], {
                    through: {
                        role: 'Owner',
                        playerStatus: true,
                        teamStatus: true,
                    },
                });

                Role.findOne({
                    where: {
                        name: 'Owner',
                        primary: true,
                    },
                }).then(role => {
                    role.addUser(userResult[0]);
                    RoleUser.findCreateFind({
                        where: {
                            UserId: userResult[0].id,
                            RoleId: role.id,
                        },
                    }).then(roleUser => {
                        roleUser[0].setTeam(teamResult[0]);
                    });
                });

                Role.findOne({
                    where: {
                        name: 'Admin',
                        primary: true,
                        global: true,
                    },
                }).then(role => {
                    role.addUser(userResult[0]);
                    RoleUser.findCreateFind({
                        where: {
                            UserId: userResult[0].id,
                            RoleId: role.id,
                        },
                    });
                });
            }

            return null;
        });

        return null;
    });
};
