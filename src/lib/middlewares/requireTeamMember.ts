import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireTeamMember = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { owner, team } = req;

    try {
        const teamUsers = await team.getUsers();
        const userInTeam = teamUsers.find(user => user.id === owner.id);

        if (
            !userInTeam ||
            !userInTeam.TeamUser.playerStatus ||
            !userInTeam.TeamUser.teamStatus
        ) {
            return next(unauthorizedError('User not part of the team'));
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
