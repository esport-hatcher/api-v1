import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import IError from '@typings/general/IError';

// tslint:disable-next-line: variable-name
export default (req: IRequest, _res: Response, next: NextFunction) => {
    if (req.user.superAdmin) {
        return next(); // user is admin so go the next function / middleware
    }
    // USER NOT ADMIN
    const error: IError = new Error('Needs to be admin');
    error.statusCode = 401;
    error.message = 'Needs to be admin';
    return next(error); // Go to error handling
};
