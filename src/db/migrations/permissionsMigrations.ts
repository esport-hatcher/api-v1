import { Permission, Action, Role } from '@models';

export const migratePermissions = async (): Promise<void> => {
    Action.findAll().then((actions: Action[]) => {
        actions.forEach((action: Action) => {
            Permission.findCreateFind({
                where: {
                    scope: action.action,
                    primary: true,
                },
            }).then(permissionResult => {
                const permission: Permission = permissionResult[0];

                permission.setActionByName(permission.scope);

                Role.findOne({
                    where: {
                        name: 'Owner',
                        primary: true,
                    },
                }).then(role => {
                    permission.addRole(role);

                    return null;
                });
            });
        });
    });
};
