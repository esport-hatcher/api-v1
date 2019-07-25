import { validationResult } from 'express-validator/check';
import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import { validationError } from '@utils/errors';

// Use express validator to check if all rules are passing, redirecting to error handler otherwise

export const requireValidation = (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    res;
    if (!errors.isEmpty()) {
        return next(validationError(errors));
    }
    next();
};
