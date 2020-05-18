import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { authenticate } from 'passport';
// tslint:disable-next-line: no-floating-promises
import('@services/passport');

// Middleware to check if the user is logged in or not

export const requireAuth = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    return authenticate(
        'jwt',
        {
            session: false,
            assignProperty: 'owner',
        },
        (err, user) => {
            if (err) {
                return next(err);
            }

            req['owner'] = user;
            return next();
        }
    )(req, res, next);
};
