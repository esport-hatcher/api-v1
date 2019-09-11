import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

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
