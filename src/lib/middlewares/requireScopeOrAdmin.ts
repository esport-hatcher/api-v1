import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireScopeOrAdmin = (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    const { owner, user } = req;

    if (!owner.superAdmin && owner.id !== user.id) {
        return next(unauthorizedError());
    }
    return next();
};
