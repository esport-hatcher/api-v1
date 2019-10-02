import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError, notFoundError } from '@utils';

export const requireScopeOrAdmin = (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    const { owner, user } = req;

    if (!user) {
        return next(notFoundError('User'));
    }
    if (!owner.superAdmin && owner.id !== user.id) {
        return next(unauthorizedError());
    }
    return next();
};
