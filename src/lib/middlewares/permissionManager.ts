import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { retrieveActionFromPath, logger, unauthorizedError } from '@utils';
import { Permission, Action, Team, Role, User } from '@models';

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
        const role: Role = await getUserRole(
            await retrieveTeamIdIfExist(req.originalUrl),
            owner
        );
        const permissionRoles: Role[] = await permission.getRoles();
        let requestAllowed: boolean = false;

        permissionRoles.forEach(permRole => {
            if (permRole.id === role.id) {
                requestAllowed = true;
            }
        });

        if (!role || !requestAllowed) {
            return next(unauthorizedError());
        }

        return next();
    } else if (permission && permission.Action.requireAuth) {
        return next(unauthorizedError());
    }

    return next();
};
