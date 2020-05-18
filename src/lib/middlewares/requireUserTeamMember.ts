import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unprocessableEntity } from '@utils';

export const requireUserTeamMember = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { user, team } = req;

    try {
        const teamUsers = await team.getUsers();
        const userInTeam = teamUsers.find(_user => user.id === _user.id);

        if (
            !userInTeam ||
            !userInTeam.TeamUser.playerStatus ||
            !userInTeam.TeamUser.teamStatus
        ) {
            return next(unprocessableEntity('User not part of the team'));
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
