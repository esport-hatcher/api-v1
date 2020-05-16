import { Permission } from '@models';

export const migratePermissions = async (): Promise<void> => {
    Permission.findCreateFind({
        where: {
            scope: 'users',
            primary: true,
        },
    }).then(permissionResult => {
        const permission = permissionResult[0];
        permission.addActionByName('get.users');
        permission.addActionByName('get.users.me');
        permission.addActionByName('get.users._');
        permission.addActionByName('post.users');
        permission.addActionByName('patch.users._');
    });
};
