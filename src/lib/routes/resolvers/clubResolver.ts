import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
import { Club } from '@models';

export const clubResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const club = await Club.findByPk(id);
        if (!club) {
            return next(notFoundError('Club'));
        }
        req.club = club;
        return next();
    } catch (err) {
        return next(err);
    }
};
