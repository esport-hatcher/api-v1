import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
import { Team } from '@models';

export const teamResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const team = await Team.findByPk(id);
        if (!team) {
            return next(notFoundError('Team'));
        }
        req.team = team;
        return next();
    } catch (err) {
        return next(err);
    }
};
