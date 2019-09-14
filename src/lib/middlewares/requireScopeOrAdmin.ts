import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireScopeOrAdmin = (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    const { userId } = req.params;
    const { user } = req;

    if (!user.superAdmin && user.id.toString() !== userId.toString()) {
        return next(unauthorizedError());
    }
    return next();
};
