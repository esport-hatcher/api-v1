import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireAdmin = (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    if (req.owner.superAdmin) {
        return next(); // user is admin so go the next function / middleware
    }
    // USER NOT ADMIN
    return next(unauthorizedError()); // Go to error handling
};
