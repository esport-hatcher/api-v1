import { Role } from '@models';

export const migrateRoles = async (): Promise<void> => {
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
