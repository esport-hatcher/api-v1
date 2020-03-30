import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError, notFoundError } from '@utils';

export const requireScopeOrSuperAdmin = (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { owner, user } = req;

    if (!user && !owner) {
        return next(notFoundError('User'));
    }
    if (!owner.superAdmin && owner.id !== user.id) {
        return next(unauthorizedError());
    }
    return next();
};
