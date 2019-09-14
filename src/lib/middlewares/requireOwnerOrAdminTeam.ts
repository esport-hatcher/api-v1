import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError, notFoundError } from '@utils';
import { Team } from '@models';

export const requireOwnerOrAdminTeam = async (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    try {
        const { user } = req;
        const { teamId } = req.params;

        const team = await Team.findByPk(teamId);
        if (!team) {
            return next(notFoundError('Team'));
        }
        const users = await team.getUsers();
        const teamUser = users.find(teamUser => teamUser.id === user.id);
        if (
            !teamUser ||
            (teamUser.TeamUser.role !== 'Owner' &&
                teamUser.TeamUser.role !== 'Admin')
        ) {
            return next(unauthorizedError());
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
