import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireOwnerTeamMember = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { owner, team } = req;

    try {
        const teamUsers = await team.getUsers();
        const ownerInTeam = teamUsers.find(user => user.id === owner.id);

        if (
            !ownerInTeam ||
            !ownerInTeam.TeamUser.playerStatus ||
            !ownerInTeam.TeamUser.teamStatus
        ) {
            return next(unauthorizedError('User not part of the team'));
        }
        /** gives access to TeamUser in req.owner */
        req.owner = ownerInTeam;
        return next();
    } catch (err) {
        return next(err);
    }
};
