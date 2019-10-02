import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { unauthorizedError } from '@utils';

export const requireStagingOrDevEnv = (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    const { owner } = req;

    if (!owner || !owner.superAdmin) {
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
