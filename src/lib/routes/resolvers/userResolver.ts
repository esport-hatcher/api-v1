import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { notFoundError } from '@utils';
import { User } from '@models';

export const userResolver = async (
    req: IRequest,
    res: Response,
    next: NextFunction,
    id: number
) => {
    try {
        res;
        const user = await User.findByPk(id);
        if (!user) {
            return next(notFoundError('User'));
        }
        req.user = user;
        return next();
    } catch (err) {
        return next(err);
    }
};
