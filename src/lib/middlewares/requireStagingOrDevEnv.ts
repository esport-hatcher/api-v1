import IRequest from '@typings/general/IRequest';
import { unauthorizedError } from '@utils/errors';
import { Response, NextFunction } from 'express';

export const requireStagingOrDevEnv = (
    req: IRequest,
    // tslint:disable-next-line: variable-name
    _res: Response,
    next: NextFunction
) => {
    const { user } = req;

    if (!user || !user.superAdmin) {
        if (
            process.env.NODE_ENV !== 'DEV' &&
            process.env.NODE_ENV !== 'staging'
        ) {
            return next(
                unauthorizedError(
                    'Should be in DEV or STAGING environment /or admin'
                )
            );
        }
        return next();
    }
    return next();
};
