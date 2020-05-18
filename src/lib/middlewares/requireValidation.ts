import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/check';
import { IRequest } from '@typings';
import { unprocessableEntity } from '@utils';

// Use express validator to check if all rules are passing, redirecting to error handler otherwise

export const requireValidation = (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    res;
    if (!errors.isEmpty()) {
        return next(unprocessableEntity('Validation errors', errors));
    }
    next();
};
