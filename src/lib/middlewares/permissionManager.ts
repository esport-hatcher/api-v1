import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { retrieveActionFromPath, logger, unauthorizedError } from '@utils';
import { Permission, Action, Team, Role, User, RoleUser } from '@models';

const getUserRole = async (teamId: number, owner: User): Promise<Role> => {
    if (teamId) {
        const team: Team = await Team.findByPk(teamId);

        if (team) {
            return team.findRoleByUser(owner);
        }

        return null;
    }

    return null;
};

const retrieveTeamIdIfExist = async (url: string): Promise<number> => {
    let teamId: string = url.match(/teams\/\d+\//g)[0];

    if (!teamId) {
        teamId = url.match(/teams\/\d+$/g)[0];
    }

    if (!teamId) {
        return null;
    }

    return parseInt(teamId.split('/')[1]);
};

export const handlePermissions = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { owner } = req;
    const action: string = retrieveActionFromPath(req);

    const permission: Permission = await Permission.findOne({
        where: {
            scope: action,
        },
        include: [Action],
    });

    logger(
        'PermissionManager',
        owner ? 'Is authenticated' : 'Anonymous request'
    );

    if (permission && permission.Action.requireAuth && owner) {
        let role: Role;

        if (permission.Action.requireTeam) {
            role = await getUserRole(
                await retrieveTeamIdIfExist(req.originalUrl),
                owner
            );
        } else {
            const roleUser: RoleUser = await RoleUser.findOne({
                where: {
                    UserId: owner.id,
                    TeamId: null,
                },
            });
            role = await Role.findByPk(roleUser.RoleId);
        }

        const permissionRoles: Role[] = await permission.getRoles();
        let requestAllowed: boolean = false;

        if (!role) {
            return next(unauthorizedError());
        }

        permissionRoles.forEach(permRole => {
            if (permRole.id === role.id) {
                requestAllowed = true;
            }
        });

        if (!requestAllowed) {
            return next(unauthorizedError());
        }

        return next();
    } else if (permission && permission.Action.requireAuth) {
        return next(unauthorizedError());
    }

    return next();
};
