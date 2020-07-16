import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireOwnerUserOrTeamAdmin = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { owner, team, user } = req;

    try {
        const teamUsers = await team.getUsers();
        const ownerInTeam = teamUsers.find(user => user.id === owner.id);
        const userInTeam = teamUsers.find(_user => _user.id === user.id);

        if (
            (user.id !== owner.id && ownerInTeam.TeamUser.role !== 'Admin') ||
            !ownerInTeam.TeamUser.playerStatus ||
            !ownerInTeam.TeamUser.teamStatus
        ) {
            return next(unauthorizedError('User not part of the team'));
        }
        /** gives access to TeamUser in req.user and req.owner */
        req.user = userInTeam;
        req.owner = ownerInTeam;
        return next();
    } catch (err) {
        return next(err);
    }
};
