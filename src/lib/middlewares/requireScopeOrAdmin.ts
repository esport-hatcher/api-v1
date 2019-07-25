import IRequest from '@typings/general/IRequest';
import { Response, NextFunction } from 'express';
import { unauthorizedError } from '@utils/errors';

export const requireScopeOrAdmin = (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    const { userID } = req.params;
    const { user } = req;

    if (!user.superAdmin && user.id.toString() !== userID.toString()) {
        return next(unauthorizedError());
    }
    return next();
};
