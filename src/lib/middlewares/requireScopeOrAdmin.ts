import IRequest from '@typings/general/IRequest';
import { Response, NextFunction } from 'express';
import IError from '@typings/general/IError';

export const requireScopeOrAdmin = (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    const { userID } = req.params;
    const { user } = req;

    if (!user.superAdmin && user.id !== userID) {
        const err: IError = new Error('Unauthorized');
        err.statusCode = 401;
        err.message = 'Unauthorized';
        return next(err);
    }
    return next();
};
