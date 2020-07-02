import { Role } from '@models';

export const migrateRoles = async (): Promise<void> => {
    await Role.findCreateFind({
        where: {
            name: 'Owner',
            primary: true,
            global: false,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'Administrator',
            primary: true,
            global: false,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'Staff',
            primary: true,
            global: false,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'Player',
            primary: true,
            global: false,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'Admin',
            primary: true,
            global: true,
        },
    });

    await Role.findCreateFind({
        where: {
            name: 'User',
            primary: true,
            global: true,
        },
    });
};
